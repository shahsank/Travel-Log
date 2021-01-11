const API_URL = 'http://localhost:9999';

export async function listLogEntries() {
    const response = await fetch(`${API_URL}/logs`,{
      method: 'GET',
      redirect: 'follow',
      credentials: "include",
    });
    return response.json();
}

export async function createLogEntry(entry) {
    const response = await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(entry),
      credentials: "include",
    });
    return response.json();
}

export async function deleteLogEntry(id) {
  const response = await fetch(`${API_URL}/logs/${id}`,{
    method: 'DELETE',
    redirect: 'follow',
    credentials: "include",
  })
  return response.json();
}

export async function updateLogEntry(data,id) {
  const response = await fetch(`${API_URL}/logs/${id}`,{
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    redirect: 'follow',
    body: JSON.stringify(data),
    credentials: "include",
  });
  return response.json();
}