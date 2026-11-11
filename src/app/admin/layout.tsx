import React from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import AdminFooter from '@/components/AdminFooter';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <AdminSidebar />
          <main className="col-md-10 py-4 px-4">{children}</main>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}
