import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Grid,
  Clipboard,
  FileText,
  MessageSquare,
  Users,
  Eye,
  Edit,
  BarChart2,
  Settings,
  Download,
} from 'react-feather';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const NavContainer = styled.nav`
  background-color: ${({ theme }) => theme.cardBg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  min-width: 250px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &.active {
    background-color: ${({ theme }) => theme.main};
    color: white;
  }

  &:hover {
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const IconWrapper = styled.div`
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const Badge = styled.span`
  margin-left: auto;
  background-color: ${({ theme }) => theme.error};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SideNav: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/messages/unread-count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(response.data.count);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const navLinks = [
    { to: '/dashboard', icon: <Grid />, text: 'Dashboard' },
    { to: '/register-patient', icon: <Clipboard />, text: 'Register Patient' },
    { to: '/consultation', icon: <FileText />, text: 'Consultation' },
    { to: '/test-results', icon: <BarChart2 />, text: 'Test Results' },
    { to: '/director-review/search', icon: <Edit />, text: "Director's Review" },
    { to: '/patient-report/search', icon: <FileText />, text: 'Patient Report' },
    { to: '/view-patients', icon: <Users />, text: 'View Patients' },
    { to: '/view-records', icon: <Eye />, text: 'View Records' },
    { to: '/messaging', icon: <MessageSquare />, text: 'Messaging', badge: unreadCount },
    { to: '/control-panel', icon: <Settings />, text: 'Control Panel' },
    { to: '/control-panel/downloads', icon: <Download />, text: 'Downloads' },
  ];

  return (
    <NavContainer>
      <NavList>
        {navLinks.map((link) => (
          <NavItem key={link.to}>
            <StyledNavLink to={link.to}>
              <IconWrapper>{link.icon}</IconWrapper>
              <span>{link.text}</span>
              {link.badge && link.badge > 0 && <Badge>{link.badge}</Badge>}
            </StyledNavLink>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default SideNav;
