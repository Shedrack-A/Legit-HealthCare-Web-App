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
