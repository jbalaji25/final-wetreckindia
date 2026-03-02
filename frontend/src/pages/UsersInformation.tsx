// UsersInformation.tsx
// Displays a table of users who have submitted the login form. Fetches data from backend API.
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface UserInformation {
  _id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

const UsersInformation: React.FC = () => {
  // State to hold user data fetched from backend
  const [users, setUsers] = useState<UserInformation[]>([]);

  useEffect(() => {
    // Fetches user data from backend API when component mounts
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    // Renders a table of user information
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Submitted Users</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Password</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserInformation) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.phone}</td>
              <td className="py-2 px-4 border-b">{user.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersInformation;