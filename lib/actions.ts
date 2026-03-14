import pool from "./db";

export const getProjects = async () => {
  try {
    const { rows } = await pool.query<{
      title: string;
      id: string;
      thumbs: string[];
      sortIndex: number;
    }>("SELECT title, thumbs, id, sortIndex FROM projects");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const getProjectById = async (id: string) => {
  try {
    const { rows } = await pool.query<{
      title: string;
      description: string;
      id: string;
      thumbs: string[];
      renders: string[];
      location: string;
      date: string;
      tools: string;
    }>(`SELECT * FROM projects WHERE "id"='${id}'`);
    return { ...rows[0], renders: rows[0].renders };
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
