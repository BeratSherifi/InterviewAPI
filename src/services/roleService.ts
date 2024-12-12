import api from './api';

export const assignRole = async (username: string, roleName: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');

  const response = await api.post(
    `/api/Auth/assign-role?username=${encodeURIComponent(username)}&roleName=${encodeURIComponent(roleName)}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(response.data);
  return `Role "${roleName}" assigned to user "${username}" successfully!`;
};

export const createRole = async (roleName: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');

  const response = await api.post(
    `/api/Auth/create-role?roleName=${encodeURIComponent(roleName)}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(response.data);
  return `Role "${roleName}" created successfully!`;
};
