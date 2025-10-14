from flask import Blueprint, jsonify, request, current_app
from .models import User, Patient, Consultation, FullBloodCount, KidneyFunctionTest, LipidProfile, LiverFunctionTest, ECG, Spirometry, Audiometry
from . import db
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    if not User.is_password_strong(password):
        return jsonify({'message': 'Password is not strong enough'}), 400

    new_user = User(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        other_name=data.get('other_name'),
        username=username,
        phone_number=data.get('phone_number'),
        email=email
    )
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    user = User.query.filter_by(username=data.get('username')).first()

    if not user or not user.check_password(data.get('password')):
        return jsonify({'message': 'Could not verify'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=30)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token})

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@bp.route('/profile')
@token_required
def profile(current_user):
    user_data = {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'username': current_user.username,
        'email': current_user.email
    }
    return jsonify(user_data)

@bp.route('/patients', methods=['POST'])
@token_required
def create_patient(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    # Basic validation
    required_fields = ['staff_id', 'first_name', 'last_name', 'department', 'gender', 'date_of_birth', 'contact_phone', 'email_address', 'race', 'nationality']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    if Patient.query.filter_by(staff_id=data['staff_id']).first():
        return jsonify({'message': 'Patient with this Staff ID already exists'}), 400

    # Generate a unique patient ID for the year (placeholder logic)
    # In a real app, this would be more robust
    patient_id = f"P{datetime.now().year}{Patient.query.count() + 1:04d}"

    dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()

    new_patient = Patient(
        staff_id=data['staff_id'],
        patient_id=patient_id,
        first_name=data['first_name'],
        middle_name=data.get('middle_name'),
        last_name=data['last_name'],
        department=data['department'],
        gender=data['gender'],
        date_of_birth=dob,
        contact_phone=data['contact_phone'],
        email_address=data['email_address'],
        race=data['race'],
        nationality=data['nationality']
    )

    db.session.add(new_patient)
    db.session.commit()

    return jsonify({'message': 'Patient registered successfully'}), 201

@bp.route('/patients/search', methods=['GET'])
@token_required
def search_patient(current_user):
    staff_id = request.args.get('staff_id')
    if not staff_id:
        return jsonify({'message': 'Staff ID parameter is required'}), 400

    patient = Patient.query.filter_by(staff_id=staff_id).first()

    if not patient:
        return jsonify({'message': 'Patient not found'}), 404

    patient_data = {
        'staff_id': patient.staff_id,
        'patient_id': patient.patient_id,
        'first_name': patient.first_name,
        'middle_name': patient.middle_name,
        'last_name': patient.last_name,
        'department': patient.department,
        'gender': patient.gender,
        'date_of_birth': patient.date_of_birth.isoformat(),
        'contact_phone': patient.contact_phone,
        'email_address': patient.email_address,
        'race': patient.race,
        'nationality': patient.nationality,
    }
    return jsonify(patient_data)

@bp.route('/consultations', methods=['POST'])
@token_required
def create_or_update_consultation(current_user):
    data = request.get_json()
    if not data or not data.get('patient_id'):
        return jsonify({'message': 'Patient ID is required'}), 400

    patient = Patient.query.get(data['patient_id'])
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404

    consultation = Consultation.query.filter_by(patient_id=patient.id).first()
    if not consultation:
        consultation = Consultation(patient_id=patient.id)
        db.session.add(consultation)

    # Update consultation fields from request data
    for key, value in data.items():
        if hasattr(consultation, key) and key != 'patient_id':
            setattr(consultation, key, value)

    db.session.commit()
    return jsonify({'message': 'Consultation saved successfully'}), 200

@bp.route('/consultations/<int:patient_id>', methods=['GET'])
@token_required
def get_consultation(current_user, patient_id):
    consultation = Consultation.query.filter_by(patient_id=patient_id).first()
    if not consultation:
        return jsonify({'message': 'Consultation not found'}), 404

    consultation_data = {key: getattr(consultation, key) for key in consultation.__table__.columns.keys()}
    return jsonify(consultation_data)

# Helper function for creating/updating test results
def create_or_update_test_result(model, patient_id):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404

    result = model.query.filter_by(patient_id=patient.id).first()
    if not result:
        result = model(patient_id=patient.id)
        db.session.add(result)

    for key, value in data.items():
        if hasattr(result, key) and key != 'patient_id':
            setattr(result, key, value)

    db.session.commit()
    return jsonify({'message': 'Test result saved successfully'}), 200

# Helper function for getting test results
def get_test_result(model, patient_id):
    result = model.query.filter_by(patient_id=patient_id).first()
    if not result:
        return jsonify({'message': 'Test result not found'}), 404

    result_data = {key: getattr(result, key) for key in result.__table__.columns.keys()}
    return jsonify(result_data)

# --- Full Blood Count ---
@bp.route('/test-results/full-blood-count/<int:patient_id>', methods=['POST'])
@token_required
def save_fbc(current_user, patient_id):
    return create_or_update_test_result(FullBloodCount, patient_id)

@bp.route('/test-results/full-blood-count/<int:patient_id>', methods=['GET'])
@token_required
def get_fbc(current_user, patient_id):
    return get_test_result(FullBloodCount, patient_id)

# --- Kidney Function Test ---
@bp.route('/test-results/kidney-function-test/<int:patient_id>', methods=['POST'])
@token_required
def save_kft(current_user, patient_id):
    return create_or_update_test_result(KidneyFunctionTest, patient_id)

@bp.route('/test-results/kidney-function-test/<int:patient_id>', methods=['GET'])
@token_required
def get_kft(current_user, patient_id):
    return get_test_result(KidneyFunctionTest, patient_id)

# --- Lipid Profile ---
@bp.route('/test-results/lipid-profile/<int:patient_id>', methods=['POST'])
@token_required
def save_lp(current_user, patient_id):
    return create_or_update_test_result(LipidProfile, patient_id)

@bp.route('/test-results/lipid-profile/<int:patient_id>', methods=['GET'])
@token_required
def get_lp(current_user, patient_id):
    return get_test_result(LipidProfile, patient_id)

# --- Liver Function Test ---
@bp.route('/test-results/liver-function-test/<int:patient_id>', methods=['POST'])
@token_required
def save_lft(current_user, patient_id):
    return create_or_update_test_result(LiverFunctionTest, patient_id)

@bp.route('/test-results/liver-function-test/<int:patient_id>', methods=['GET'])
@token_required
def get_lft(current_user, patient_id):
    return get_test_result(LiverFunctionTest, patient_id)

# --- ECG ---
@bp.route('/test-results/ecg/<int:patient_id>', methods=['POST'])
@token_required
def save_ecg(current_user, patient_id):
    return create_or_update_test_result(ECG, patient_id)

@bp.route('/test-results/ecg/<int:patient_id>', methods=['GET'])
@token_required
def get_ecg(current_user, patient_id):
    return get_test_result(ECG, patient_id)

# --- Spirometry ---
@bp.route('/test-results/spirometry/<int:patient_id>', methods=['POST'])
@token_required
def save_spirometry(current_user, patient_id):
    return create_or_update_test_result(Spirometry, patient_id)

@bp.route('/test-results/spirometry/<int:patient_id>', methods=['GET'])
@token_required
def get_spirometry(current_user, patient_id):
    return get_test_result(Spirometry, patient_id)

# --- Audiometry ---
@bp.route('/test-results/audiometry/<int:patient_id>', methods=['POST'])
@token_required
def save_audiometry(current_user, patient_id):
    return create_or_update_test_result(Audiometry, patient_id)

@bp.route('/test-results/audiometry/<int:patient_id>', methods=['GET'])
@token_required
def get_audiometry(current_user, patient_id):
    return get_test_result(Audiometry, patient_id)
