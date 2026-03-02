import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface User {
  _id: string;
  username: string;
  password: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-emerald-700">Submitted Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Password</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-6 px-6 text-center text-gray-500">No users submitted yet.</td>
              </tr>
            ) : (
              users.map((user: User) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{user.username}</td>
                  <td className="py-3 px-6">{user.password}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;