interface MongoDBRequest {
  uri: string;
  database: string;
  collection: string;
  action: 'find' | 'findOne' | 'insertOne' | 'updateOne';
  filter?: Record<string, any>;
  document?: Record<string, any>;
  update?: Record<string, any>;
}

export async function fetchData(uri: string, database: string, collection: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          uri,
          database,
          collection,
          action: 'find'
        } as MongoDBRequest)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch data');
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

export async function findOne(uri: string, database: string, collection: string, filter: Record<string, any>) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          uri,
          database,
          collection,
          action: 'findOne',
          filter
        } as MongoDBRequest)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch document');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch document:', error);
    throw error;
  }
}

export async function insertOne(uri: string, database: string, collection: string, document: Record<string, any>) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          uri,
          database,
          collection,
          action: 'insertOne',
          document
        } as MongoDBRequest)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to insert document');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to insert document:', error);
    throw error;
  }
}

export async function updateOne(
  uri: string,
  database: string,
  collection: string,
  filter: Record<string, any>,
  update: Record<string, any>
) {
  try {
    console.log('Sending update request:', {
      uri,
      database,
      collection,
      filter,
      update
    });

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          uri,
          database,
          collection,
          action: 'updateOne',
          filter,
          update
        } as MongoDBRequest)
      }
    );

    const responseData = await response.json();
    console.log('Update response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update document');
    }

    return responseData.data;
  } catch (error) {
    console.error('Failed to update document:', error);
    throw error;
  }
}