from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os
import click

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()

def create_app(config_class='backend.config.Config'):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Configure and create the upload folder
    upload_folder = os.path.join(app.root_path, 'uploads')
    app.config['UPLOAD_FOLDER'] = upload_folder
    try:
        os.makedirs(upload_folder)
    except OSError:
        pass

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Allow all origins for now

    from . import routes
    from . import models
    app.register_blueprint(routes.bp)

    @app.cli.command("register-permissions")
    def register_permissions():
        """Creates all defined permissions in the database."""
        from .models import Permission, db

        permissions = [
            # User Management
            'manage_users', 'view_users', 'create_users', 'edit_users', 'delete_users',
            # Role Management
            'manage_roles', 'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
            # Patient Management
            'register_patient', 'view_patient_data', 'manage_patient_records',
            'upload_patient_data', 'claim_patient_account',
            # Screening Management
            'manage_screening_records', 'view_screening_records',
            'delete_screening_record', 'register_for_screening',
            # Clinical Data
            'perform_consultation', 'enter_test_results', 'perform_director_review',
            # System & Other
            'view_statistics', 'manage_branding', 'view_audit_log', 'email_report',
            # Downloads
            'download_patient_biodata', 'download_screening_data', 'download_screening_biodata'
        ]

        for name in permissions:
            if not Permission.query.filter_by(name=name).first():
                permission = Permission(name=name)
                db.session.add(permission)
                print(f"Permission '{name}' created.")

        db.session.commit()
        print("Permissions registration complete.")

    @app.cli.command("create-admin")
    @click.argument('password')
    def create_admin(password):
        """Creates the admin user and assigns the admin role."""
        from .models import User, Role, Permission, db

        # First, ensure all permissions are registered
        register_permissions.callback()

        username = 'admin'
        if User.query.filter_by(username=username).first():
            print(f"User '{username}' already exists.")
            return

        # Create the admin user
        admin_user = User(
            username=username,
            first_name='Admin',
            last_name='User',
            email='admin@system.com',
            phone_number='0000000000'
        )
        admin_user.set_password(password)
        db.session.add(admin_user)

        # Find or create the admin role
        admin_role = Role.query.filter_by(name='admin').first()
        if not admin_role:
            admin_role = Role(name='admin')
            db.session.add(admin_role)
            print("Role 'admin' created.")

        # Assign all permissions to the admin role
        all_permissions = Permission.query.all()
        admin_role.permissions.extend(all_permissions)

        # Assign the admin role to the admin user
        admin_user.roles.append(admin_role)

        db.session.commit()
        print(f"User '{username}' created and assigned the 'admin' role with all permissions.")

    return app