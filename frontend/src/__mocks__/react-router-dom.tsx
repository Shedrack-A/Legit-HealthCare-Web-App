import React from 'react';

// Mock implementation for react-router-dom
export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const MemoryRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Routes = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Route = ({ element }: { element: React.ReactNode }) => element;
export const Link = ({ to, children }: { to: string, children: React.ReactNode }) => <a href={to}>{children}</a>;
export const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => <a href={to}>{children}</a>;
export const Navigate = ({ to }: { to: string }) => <div>Navigating to {to}</div>;
export const Outlet = () => <div>Outlet</div>;
export const useParams = () => ({});
export const useLocation = () => ({ pathname: '/' });
export const useNavigate = () => (() => {});
