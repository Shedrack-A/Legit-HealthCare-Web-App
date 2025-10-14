from flask import Blueprint, jsonify, request, current_app
from .models import User, Patient, ScreeningBioData, Consultation, FullBloodCount, KidneyFunctionTest, LipidProfile, LiverFunctionTest, ECG, Spirometry, Audiometry
from . import db
import jwt
from datetime import datetime, timedelta, timezone, date
from functools import wraps
from sqlalchemy import func

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

def token_required(permission=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
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

            if permission:
                user_permissions = {p.name for role in current_user.roles for p in role.permissions}
                if permission not in user_permissions:
                    return jsonify({'message': 'You do not have permission to perform this action.'}), 403

            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator

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

@bp.route('/patient-summary/<string:staff_id>', methods=['GET'])
@token_required
def get_patient_summary(current_user, staff_id):
    """
    Aggregates all data for a single patient from multiple tables.
    """
    patient = Patient.query.filter_by(staff_id=staff_id).first_or_404()

    # Start with the patient's own data
    summary = {
        'patient_id': patient.id,
        'staff_id': patient.staff_id,
        'first_name': patient.first_name,
        'middle_name': patient.middle_name,
        'last_name': patient.last_name,
        'department': patient.department,
        'gender': patient.gender,
        'date_of_birth': patient.date_of_birth.isoformat(),
        'age': (date.today().year - patient.date_of_birth.year),
        'contact_phone': patient.contact_phone,
        'email_address': patient.email_address,
        'race': patient.race,
        'nationality': patient.nationality,
    }

    # Helper function to merge data from related objects
    def merge_data(obj):
        if obj:
            # Exclude SQLAlchemy internal state and keys we already have
            exclude_keys = ['_sa_instance_state', 'id', 'patient_id', 'patient']
            for key, value in obj.__dict__.items():
                if key not in exclude_keys:
                    summary[key] = value

    # Use the relationships defined in the Patient model
    merge_data(patient.consultation)
    merge_data(patient.full_blood_count)
    merge_data(patient.kidney_function_test)
    merge_data(patient.lipid_profile)
    merge_data(patient.liver_function_test)
    merge_data(patient.ecg)
    merge_data(patient.spirometry)
    merge_data(patient.audiometry)

    return jsonify(summary)

@bp.route('/save-director-review/<string:staff_id>', methods=['POST'])
@token_required
def save_director_review(current_user, staff_id):
    """
    Receives the flattened data from the Director's Form and updates all
    the corresponding database models.
    """
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    patient = Patient.query.filter_by(staff_id=staff_id).first_or_404()

    # Helper function to update an object with data from the form
    def update_model(obj, model_fields):
        if not obj:
            return # Should not happen if data is loaded correctly, but a safe check
        for field in model_fields:
            if field in data and hasattr(obj, field):
                setattr(obj, field, data[field])

    # --- Update Consultation ---
    consultation_fields = [
        'diabetes_mellitus', 'hypertension', 'bp', 'pulse', 'spo2', 'hs', 'breast_exam',
        'breast_exam_remark', 'abdomen', 'prostrate_specific_antigen', 'psa_remark',
        'fbs', 'rbs', 'fbs_rbs_remark', 'urine_analysis', 'ua_remark',
        'assessment_hx_pe', 'other_assessments', 'overall_lab_remark', 'other_remarks',
        'overall_assessment', 'comment_one', 'comment_two', 'comment_three', 'comment_four'
    ]
    # Ensure consultation object exists
    if not patient.consultation:
        patient.consultation = Consultation(patient_id=patient.id)
        db.session.add(patient.consultation)
    update_model(patient.consultation, consultation_fields)

    # --- Update ECG ---
    if not patient.ecg:
        patient.ecg = ECG(patient_id=patient.id)
        db.session.add(patient.ecg)
    update_model(patient.ecg, ['ecg_result', 'remark'])

    # --- Update Spirometry ---
    if not patient.spirometry:
        patient.spirometry = Spirometry(patient_id=patient.id)
        db.session.add(patient.spirometry)
    update_model(patient.spirometry, ['spirometry_result', 'spirometry_remark'])

    # --- Update Audiometry ---
    if not patient.audiometry:
        patient.audiometry = Audiometry(patient_id=patient.id)
        db.session.add(patient.audiometry)
    update_model(patient.audiometry, ['audiometry_result', 'audiometry_remark'])

    # Commit all changes to the database
    db.session.commit()

    return jsonify({'message': 'Director review saved successfully.'}), 200

@bp.route('/patients', methods=['GET'])
@token_required
def get_all_patients(current_user):
    """
    Returns a list of all patients in the comprehensive database.
    """
    patients = Patient.query.order_by(Patient.first_name, Patient.last_name).all()

    results = [{
        'staff_id': p.staff_id,
        'first_name': p.first_name,
        'last_name': p.last_name,
        'department': p.department,
        'gender': p.gender,
        'contact_phone': p.contact_phone,
    } for p in patients]

    return jsonify(results)

@bp.route('/patient/<string:staff_id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, staff_id):
    """
    Deletes a patient and all their associated data.
    """
    patient = Patient.query.filter_by(staff_id=staff_id).first_or_404()
    db.session.delete(patient)
    db.session.commit()
    return jsonify({'message': 'Patient deleted successfully.'}), 200

@bp.route('/patient/<string:staff_id>', methods=['PUT'])
@token_required
def update_patient(current_user, staff_id):
    """
    Updates a patient's comprehensive bio-data.
    """
    patient = Patient.query.filter_by(staff_id=staff_id).first_or_404()
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    # List of fields that can be updated
    updatable_fields = [
        'staff_id', 'first_name', 'middle_name', 'last_name', 'department',
        'gender', 'date_of_birth', 'contact_phone', 'email_address',
        'race', 'nationality'
    ]

    for field in updatable_fields:
        if field in data:
            if field == 'date_of_birth':
                setattr(patient, field, datetime.strptime(data[field], '%Y-%m-%d').date())
            else:
                setattr(patient, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Patient updated successfully.'}), 200

@bp.route('/screening/records', methods=['GET'])
@token_required
def get_screening_records(current_user):
    """
    Returns a list of patients registered for a specific screening year and company.
    """
    screening_year = request.args.get('screening_year', type=int)
    company_section = request.args.get('company_section')

    if not screening_year or not company_section:
        return jsonify({'message': 'screening_year and company_section parameters are required'}), 400

    records = db.session.query(
        ScreeningBioData.id.label('record_id'),
        ScreeningBioData.patient_id_for_year.label('patient_id'),
        Patient.staff_id,
        Patient.first_name,
        Patient.last_name,
        Patient.department,
        Patient.gender,
        Patient.contact_phone
    ).join(
        Patient, ScreeningBioData.patient_comprehensive_id == Patient.id
    ).filter(
        ScreeningBioData.screening_year == screening_year,
        ScreeningBioData.company_section == company_section
    ).order_by(Patient.first_name, Patient.last_name).all()

    return jsonify([{
        'record_id': r.record_id,
        'patient_id': r.patient_id,
        'staff_id': r.staff_id,
        'first_name': r.first_name,
        'last_name': r.last_name,
        'department': r.department,
        'gender': r.gender,
        'contact_phone': r.contact_phone,
    } for r in records])

@bp.route('/screening/record/<int:record_id>', methods=['DELETE'])
@token_required
def delete_screening_record(current_user, record_id):
    """
    Deletes a specific screening record.
    """
    record = ScreeningBioData.query.get_or_404(record_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Screening record deleted successfully.'}), 200

@bp.route('/consultations', methods=['POST'])
@token_required
def create_or_update_consultation(current_user):
    data = request.get_json()
    if not data or not data.get('staff_id'):
        return jsonify({'message': 'Staff ID is required'}), 400

    patient = Patient.query.filter_by(staff_id=data['staff_id']).first()
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

@bp.route('/consultations/<string:staff_id>', methods=['GET'])
@token_required
def get_consultation(current_user, staff_id):
    consultation = db.session.query(Consultation).join(Patient).filter(Patient.staff_id == staff_id).first()
    if not consultation:
        return jsonify({'message': 'Consultation not found'}), 404

    consultation_data = {key: getattr(consultation, key) for key in consultation.__table__.columns.keys()}
    return jsonify(consultation_data)

# Helper function for creating/updating test results
def create_or_update_test_result(model, staff_id):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    patient = Patient.query.filter_by(staff_id=staff_id).first()
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
def get_test_result(model, staff_id):
    result = db.session.query(model).join(Patient).filter(Patient.staff_id == staff_id).first()
    if not result:
        return jsonify({'message': 'Test result not found'}), 404

    result_data = {key: getattr(result, key) for key in result.__table__.columns.keys()}
    return jsonify(result_data)

# --- Full Blood Count ---
@bp.route('/test-results/full-blood-count/<string:staff_id>', methods=['POST'])
@token_required
def save_fbc(current_user, staff_id):
    return create_or_update_test_result(FullBloodCount, staff_id)

@bp.route('/test-results/full-blood-count/<string:staff_id>', methods=['GET'])
@token_required
def get_fbc(current_user, staff_id):
    return get_test_result(FullBloodCount, staff_id)

# --- Kidney Function Test ---
@bp.route('/test-results/kidney-function-test/<string:staff_id>', methods=['POST'])
@token_required
def save_kft(current_user, staff_id):
    return create_or_update_test_result(KidneyFunctionTest, staff_id)

@bp.route('/test-results/kidney-function-test/<string:staff_id>', methods=['GET'])
@token_required
def get_kft(current_user, staff_id):
    return get_test_result(KidneyFunctionTest, staff_id)

# --- Lipid Profile ---
@bp.route('/test-results/lipid-profile/<string:staff_id>', methods=['POST'])
@token_required
def save_lp(current_user, staff_id):
    return create_or_update_test_result(LipidProfile, staff_id)

@bp.route('/test-results/lipid-profile/<string:staff_id>', methods=['GET'])
@token_required
def get_lp(current_user, staff_id):
    return get_test_result(LipidProfile, staff_id)

# --- Liver Function Test ---
@bp.route('/test-results/liver-function-test/<string:staff_id>', methods=['POST'])
@token_required
def save_lft(current_user, staff_id):
    return create_or_update_test_result(LiverFunctionTest, staff_id)

@bp.route('/test-results/liver-function-test/<string:staff_id>', methods=['GET'])
@token_required
def get_lft(current_user, staff_id):
    return get_test_result(LiverFunctionTest, staff_id)

# --- ECG ---
@bp.route('/test-results/ecg/<string:staff_id>', methods=['POST'])
@token_required
def save_ecg(current_user, staff_id):
    return create_or_update_test_result(ECG, staff_id)

@bp.route('/test-results/ecg/<string:staff_id>', methods=['GET'])
@token_required
def get_ecg(current_user, staff_id):
    return get_test_result(ECG, staff_id)

# --- Spirometry ---
@bp.route('/test-results/spirometry/<string:staff_id>', methods=['POST'])
@token_required
def save_spirometry(current_user, staff_id):
    return create_or_update_test_result(Spirometry, staff_id)

@bp.route('/test-results/spirometry/<string:staff_id>', methods=['GET'])
@token_required
def get_spirometry(current_user, staff_id):
    return get_test_result(Spirometry, staff_id)

# --- Audiometry ---
@bp.route('/test-results/audiometry/<string:staff_id>', methods=['POST'])
@token_required
def save_audiometry(current_user, staff_id):
    return create_or_update_test_result(Audiometry, staff_id)

@bp.route('/test-results/audiometry/<string:staff_id>', methods=['GET'])
@token_required
def get_audiometry(current_user, staff_id):
    return get_test_result(Audiometry, staff_id)

@bp.route('/screening/register', methods=['POST'])
@token_required
def register_for_screening(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    # --- 1. Validate Input Data ---
    required_fields = [
        'staff_id', 'first_name', 'last_name', 'department', 'gender',
        'date_of_birth', 'contact_phone', 'email_address', 'race',
        'nationality', 'screening_year', 'company_section', 'patient_id_for_year'
    ]
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({'message': f'Missing required fields: {", ".join(missing)}'}), 400

    # --- 2. Find or Create Comprehensive Patient Record ---
    patient = Patient.query.filter_by(staff_id=data['staff_id']).first()
    dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()

    if patient:
        # Update existing patient's comprehensive data
        patient.first_name = data['first_name']
        patient.middle_name = data.get('middle_name')
        patient.last_name = data['last_name']
        patient.department = data['department']
        patient.gender = data['gender']
        patient.date_of_birth = dob
        patient.contact_phone = data['contact_phone']
        patient.email_address = data['email_address']
        patient.race = data['race']
        patient.nationality = data['nationality']
    else:
        # Create a new patient
        patient = Patient(
            staff_id=data['staff_id'],
            # The patient_id in the comprehensive table is not the yearly one
            patient_id=data['staff_id'], # Or generate another unique one
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
        db.session.add(patient)

    # We need to commit here to get the patient.id if it's a new patient
    db.session.commit()

    # --- 3. Check for Duplicate Screening Registration ---
    existing_screening = ScreeningBioData.query.filter_by(
        patient_comprehensive_id=patient.id,
        screening_year=data['screening_year'],
        company_section=data['company_section']
    ).first()

    if existing_screening:
        return jsonify({'message': 'Patient already registered for this screening year and company section.'}), 409

    # Check if the year-specific patient ID is already in use for this context
    existing_patient_id_for_year = ScreeningBioData.query.filter_by(
        patient_id_for_year=data['patient_id_for_year'],
        screening_year=data['screening_year'],
        company_section=data['company_section']
    ).first()

    if existing_patient_id_for_year:
        return jsonify({'message': 'The patient ID for this year is already taken.'}), 409

    # --- 4. Create New ScreeningBioData Record ---
    new_screening_record = ScreeningBioData(
        patient_comprehensive_id=patient.id,
        patient_id_for_year=data['patient_id_for_year'],
        screening_year=data['screening_year'],
        company_section=data['company_section']
    )
    db.session.add(new_screening_record)
    db.session.commit()

    return jsonify({'message': 'Patient registered for screening successfully.'}), 201

@bp.route('/screening/stats', methods=['GET'])
@token_required
def screening_stats(current_user):
    # --- 1. Get and Validate Query Parameters ---
    screening_year = request.args.get('screening_year', type=int)
    company_section = request.args.get('company_section')

    if not screening_year or not company_section:
        return jsonify({'message': 'screening_year and company_section parameters are required'}), 400

    # --- 2. Base Query for the given context ---
    base_query = ScreeningBioData.query.filter_by(
        screening_year=screening_year,
        company_section=company_section
    )

    # --- 3. Calculate Statistics ---
    total_registered = base_query.count()

    today_start = datetime.utcnow().date()
    registered_today = base_query.filter(func.date(ScreeningBioData.date_registered) == today_start).count()

    # Join with Patient table for gender and age
    query_with_join = base_query.join(Patient, ScreeningBioData.patient_comprehensive_id == Patient.id)

    male_count = query_with_join.filter(Patient.gender == 'Male').count()
    female_count = query_with_join.filter(Patient.gender == 'Female').count()

    # Age calculation (database-agnostic)
    # This method calculates the difference in years. It's simple, portable,
    # and sufficient for this statistical purpose.
    from sqlalchemy.sql import extract
    age_calc = extract('year', func.current_date()) - extract('year', Patient.date_of_birth)

    over_40_count = query_with_join.filter(age_calc >= 40).count()
    under_40_count = query_with_join.filter(age_calc < 40).count()

    # --- 4. Format and Return Response ---
    stats = {
        'total_registered': total_registered,
        'registered_today': registered_today,
        'male_count': male_count,
        'female_count': female_count,
        'over_40_count': over_40_count,
        'under_40_count': under_40_count
    }

    return jsonify(stats)

@bp.route('/screening/search', methods=['GET'])
@token_required
def search_screened_patients(current_user):
    # --- 1. Get and Validate Query Parameters ---
    screening_year = request.args.get('screening_year', type=int)
    company_section = request.args.get('company_section')
    search_term = request.args.get('searchTerm', '')

    if not screening_year or not company_section:
        return jsonify({'message': 'screening_year and company_section parameters are required'}), 400

    # --- 2. Build the Query ---
    query = db.session.query(
        Patient
    ).join(
        ScreeningBioData, Patient.id == ScreeningBioData.patient_comprehensive_id
    ).filter(
        ScreeningBioData.screening_year == screening_year,
        ScreeningBioData.company_section == company_section
    )

    if search_term:
        query = query.filter(Patient.staff_id.ilike(f'%{search_term}%'))

    # --- 3. Execute Query and Format Results ---
    patients = query.limit(10).all() # Limit results for performance

    results = [{
        'id': p.id,
        'staff_id': p.staff_id,
        'first_name': p.first_name,
        'last_name': p.last_name,
        'department': p.department,
        'age': (date.today().year - p.date_of_birth.year)
    } for p in patients]

    return jsonify(results)

@bp.route('/patient/<string:staff_id>', methods=['GET'])
@token_required
def get_patient_by_staff_id(current_user, staff_id):
    patient = Patient.query.filter_by(staff_id=staff_id).first_or_404()

    patient_data = {
        'id': patient.id,
        'staff_id': patient.staff_id,
        'first_name': patient.first_name,
        'last_name': patient.last_name,
        'department': patient.department,
        'age': (date.today().year - patient.date_of_birth.year)
    }
    return jsonify(patient_data)

# RBAC Routes
@bp.route('/users', methods=['GET'])
@token_required('manage_users')
def get_users(current_user):
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username, 'email': u.email, 'roles': [r.name for r in u.roles]} for u in users])

@bp.route('/roles', methods=['GET'])
@token_required('manage_roles')
def get_roles(current_user):
    roles = Role.query.all()
    return jsonify([{'id': r.id, 'name': r.name} for r in roles])

@bp.route('/user/<int:user_id>/assign-role', methods=['POST'])
@token_required('manage_users')
def assign_role(current_user, user_id):
    data = request.get_json()
    if not data or 'role_id' not in data:
        return jsonify({'message': 'Role ID is required'}), 400

    user = User.query.get_or_404(user_id)
    role = Role.query.get_or_404(data['role_id'])

    user.roles.append(role)
    db.session.commit()

    return jsonify({'message': f'Role {role.name} assigned to user {user.username} successfully.'})

@bp.route('/permissions', methods=['GET'])
@token_required('manage_roles')
def get_permissions(current_user):
    permissions = Permission.query.all()
    return jsonify([{'id': p.id, 'name': p.name} for p in permissions])

@bp.route('/roles/<int:role_id>', methods=['GET'])
@token_required('manage_roles')
def get_role(current_user, role_id):
    role = Role.query.get_or_404(role_id)
    return jsonify({
        'id': role.id,
        'name': role.name,
        'permissions': [p.id for p in role.permissions]
    })

@bp.route('/roles', methods=['POST'])
@token_required('manage_roles')
def create_role(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'message': 'Role name is required'}), 400

    new_role = Role(name=data['name'])
    db.session.add(new_role)
    db.session.commit()

    return jsonify({'id': new_role.id, 'name': new_role.name, 'permissions': []}), 201

@bp.route('/roles/<int:role_id>', methods=['PUT'])
@token_required('manage_roles')
def update_role(current_user, role_id):
    role = Role.query.get_or_404(role_id)
    data = request.get_json()

    if 'name' in data:
        role.name = data['name']

    if 'permission_ids' in data:
        role.permissions = []
        for p_id in data['permission_ids']:
            permission = Permission.query.get(p_id)
            if permission:
                role.permissions.append(permission)

    db.session.commit()
    return jsonify({'message': 'Role updated successfully.'})

@bp.route('/roles/<int:role_id>', methods=['DELETE'])
@token_required('manage_roles')
def delete_role(current_user, role_id):
    role = Role.query.get_or_404(role_id)

    # Basic protection for Admin role
    if role.name == 'Admin':
        return jsonify({'message': 'The Admin role cannot be deleted.'}), 403

    db.session.delete(role)
    db.session.commit()
    return jsonify({'message': 'Role deleted successfully.'})
