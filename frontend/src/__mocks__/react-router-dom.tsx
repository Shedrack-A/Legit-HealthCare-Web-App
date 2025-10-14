import React from 'react';

const MockRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const BrowserRouter = MockRouter;
export const MemoryRouter = MockRouter;
export const Routes = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Route = ({ element }: { element: React.ReactNode }) => <div>{element}</div>;
export const Link = ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>;
export const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>;
export const useNavigate = jest.fn();
export const Outlet = () => <div>Outlet</div>;
