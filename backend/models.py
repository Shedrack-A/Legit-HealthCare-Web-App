from . import db, bcrypt
from datetime import datetime
import re

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    other_name = db.Column(db.String(50))
    username = db.Column(db.String(50), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    # Relationships and other fields will be added later

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    @staticmethod
    def is_password_strong(password):
        if len(password) < 8:
            return False
        if not re.search("[a-z]", password):
            return False
        if not re.search("[A-Z]", password):
            return False
        if not re.search("[0-9]", password):
            return False
        if not re.search("[!@#$%^&*()]", password):
            return False
        return True

    def __repr__(self):
        return f'<User {self.username}>'

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.String(50), unique=True, nullable=False)
    patient_id = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    middle_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    contact_phone = db.Column(db.String(20), nullable=False)
    email_address = db.Column(db.String(120), nullable=False)
    race = db.Column(db.String(50), nullable=False)
    nationality = db.Column(db.String(50), nullable=False)
    date_registered = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    consultation = db.relationship('Consultation', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    full_blood_count = db.relationship('FullBloodCount', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    kidney_function_test = db.relationship('KidneyFunctionTest', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    lipid_profile = db.relationship('LipidProfile', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    liver_function_test = db.relationship('LiverFunctionTest', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    ecg = db.relationship('ECG', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    spirometry = db.relationship('Spirometry', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    audiometry = db.relationship('Audiometry', back_populates='patient', uselist=False, cascade="all, delete-orphan")
    # This is the comprehensive bio-data table

    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'

class Consultation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='consultation')

    luts = db.Column(db.String(50))
    chronic_cough = db.Column(db.String(50))
    chronic_chest_pain = db.Column(db.String(50))
    chest_infection = db.Column(db.String(50))
    heart_dx = db.Column(db.String(50))
    palor = db.Column(db.String(50))
    jaundice = db.Column(db.String(50))
    murmur = db.Column(db.String(50))
    chest = db.Column(db.String(50))
    prostrate_specific_antigen = db.Column(db.String(50))
    psa_remark = db.Column(db.Text)
    fbs = db.Column(db.String(50))
    rbs = db.Column(db.String(50))
    fbs_rbs_remark = db.Column(db.String(50))
    urine_analysis = db.Column(db.String(100))
    ua_remark = db.Column(db.String(50))
    diabetes_mellitus = db.Column(db.String(100))
    hypertension = db.Column(db.String(100))
    bp = db.Column(db.String(20))
    pulse = db.Column(db.String(20))
    spo2 = db.Column(db.String(20))
    hs = db.Column(db.String(50))
    breast_exam = db.Column(db.String(50))
    breast_exam_remark = db.Column(db.Text)
    abdomen = db.Column(db.String(50))
    assessment_hx_pe = db.Column(db.String(100))
    other_assessments = db.Column(db.Text)
    overall_lab_remark = db.Column(db.Text)
    other_remarks = db.Column(db.Text)
    overall_assessment = db.Column(db.Text)

    def __repr__(self):
        return f'<Consultation for Patient {self.patient_id}>'

class FullBloodCount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='full_blood_count')
    hct = db.Column(db.Float)
    wbc = db.Column(db.Float)
    plt = db.Column(db.Float)
    lymp_percent = db.Column(db.Float)
    lymp = db.Column(db.Float)
    gra_percent = db.Column(db.Float)
    gra = db.Column(db.Float)
    mid_percent = db.Column(db.Float)
    mid = db.Column(db.Float)
    rbc = db.Column(db.Float)
    mcv = db.Column(db.Float)
    mch = db.Column(db.Float)
    mchc = db.Column(db.Float)
    rdw = db.Column(db.Float)
    pdw = db.Column(db.Float)
    hgb = db.Column(db.Float)
    fbc_remark = db.Column(db.Text)
    other_remarks = db.Column(db.Text)

class KidneyFunctionTest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='kidney_function_test')
    k = db.Column(db.Float)
    na = db.Column(db.Float)
    cl = db.Column(db.Float)
    ca = db.Column(db.Float)
    hc03 = db.Column(db.Float)
    urea = db.Column(db.Float)
    cre = db.Column(db.Float)
    kft_remark = db.Column(db.Text)
    other_remarks = db.Column(db.Text)

class LipidProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='lipid_profile')
    tcho = db.Column(db.Float)
    tg = db.Column(db.Float)
    hdl = db.Column(db.Float)
    ldl = db.Column(db.Float)
    lp_remark = db.Column(db.Text)
    other_remarks = db.Column(db.Text)

class LiverFunctionTest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='liver_function_test')
    ast = db.Column(db.Float)
    alt = db.Column(db.Float)
    alp = db.Column(db.Float)
    tb = db.Column(db.Float)
    cb = db.Column(db.Float)
    lft_remark = db.Column(db.Text)
    other_remarks = db.Column(db.Text)

class ECG(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='ecg')
    ecg_result = db.Column(db.Text)
    remark = db.Column(db.Text)

class Spirometry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='spirometry')
    spirometry_result = db.Column(db.Text)
    spirometry_remark = db.Column(db.Text)

class Audiometry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False, unique=True)
    patient = db.relationship('Patient', back_populates='audiometry')
    audiometry_result = db.Column(db.Text)
    audiometry_remark = db.Column(db.Text)

class ScreeningBioData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_comprehensive_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    patient_comprehensive = db.relationship('Patient', backref='screening_records')

    # Year-specific Patient ID, unique for that year and company section
    patient_id_for_year = db.Column(db.String(50), nullable=False)

    screening_year = db.Column(db.Integer, nullable=False)
    company_section = db.Column(db.String(10), nullable=False) # 'DCP' or 'DCT'

    date_registered = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('patient_id_for_year', 'screening_year', 'company_section', name='_patient_id_year_company_uc'),
        db.UniqueConstraint('patient_comprehensive_id', 'screening_year', 'company_section', name='_patient_comprehensive_year_company_uc'),
    )

    def __repr__(self):
        return f'<ScreeningBioData for Patient {self.patient_comprehensive_id} in {self.screening_year}>'
