import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Role {
  id: number;
  name: string;
  permissions: number[];
}

interface Permission {
  id: number;
  name: string;
}

interface EditRoleModalProps {
  role: Role;
  allPermissions: Permission[];
  onClose: () => void;
  onSave: (roleId: number, permissionIds: number[]) => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  role,
  allPermissions,
  onClose,
  onSave,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    role.permissions
  );

  const handleCheckboxChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    onSave(role.id, selectedPermissions);
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Edit Role: {role.name}</h2>

        <CheckboxContainer>
          {allPermissions.map((p) => (
            <CheckboxLabel key={p.id}>
              <input
                type="checkbox"
                checked={selectedPermissions.includes(p.id)}
                onChange={() => handleCheckboxChange(p.id)}
              />
              {p.name}
            </CheckboxLabel>
          ))}
        </CheckboxContainer>

        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose} style={{ marginLeft: '1rem' }}>
            Cancel
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default EditRoleModal;
