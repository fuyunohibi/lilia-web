import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const teamSchema = z.object({
  teamName: z.string().min(1),
  members: z.array(z.string()).min(1),
  gardenOwner: z.string(),
  gardenId: z.number(),
});

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { teamName, members, gardenOwner, gardenId } = teamSchema.parse(body);
  
      const client = await pool.connect();
  
      try {
        await client.query('BEGIN');
  
        const userExistsPromises = members.map((userId: string) =>
          client.query('SELECT 1 FROM users WHERE user_id = $1', [userId])
        );
  
        // Check if all members exist in the users table
        const userExistsResults = await Promise.all(userExistsPromises);
  
        // If any user does not exist, return an error
        const invalidMembers = userExistsResults.filter(result => result.rowCount === 0);
  
        if (invalidMembers.length > 0) {
          const invalidUserIds = invalidMembers.map(() => 'User does not exist in users table');
          return NextResponse.json({
            message: invalidUserIds.join(', '),
          }, { status: 400 });
        }
  
        const teamResult = await client.query(
          'INSERT INTO teams (team_name, garden_owner, garden_id) VALUES ($1, $2, $3) RETURNING team_id',
          [teamName, gardenOwner, gardenId]
        );
  
        const teamId = teamResult.rows[0].team_id;
  
        const insertMemberPromises = members.map((userId: string) =>
          client.query(
            'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
            [teamId, userId]
          )
        );
  
        await Promise.all(insertMemberPromises);
  
        await client.query('COMMIT');
  
        return NextResponse.json({ message: 'Team created successfully!' }, { status: 201 });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during team creation:', error);
        return NextResponse.json({ message: 'Failed to create team' }, { status: 500 });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Request validation error:', error);
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }
  }
  