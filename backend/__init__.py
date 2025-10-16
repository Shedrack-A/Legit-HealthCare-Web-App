from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

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
            'manage_users', 'manage_roles', 'register_patient', 'view_patient_data',
            'manage_patient_records', 'manage_screening_records', 'perform_consultation',
            'enter_test_results', 'perform_director_review', 'view_statistics'
        ]

        for name in permissions:
            if not Permission.query.filter_by(name=name).first():
                permission = Permission(name=name)
                db.session.add(permission)
                print(f"Permission '{name}' created.")

        db.session.commit()
        print("Permissions registration complete.")

    return app
