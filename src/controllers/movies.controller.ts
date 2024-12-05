import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import axiosClientService from '../services/movies.service';
import { Movie, Editor } from '../models/movies.model';


dotenv.config({ path: path.join(__dirname, "../../.env") });

const API_KEY = process.env.API_KEY;

// API Headers
const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

// getMoviesByYear is Helper function, synchrously fetch movie / Editors data & Transform
const getMoviesByYear = async (req: Request, res: Response): Promise<any> => {
  const { year, page = 1 } = req.query;
  if (!year || Number.isNaN(year)) {
    res.status(400).json({ error: 'Year is required and Valid Number' });
    return;
  }
  // if (Number.isNaN(page)) {
  //   res.status(400).json({ error: 'Page is required and Valid Number' });
  //   return;
  // }
  try {
    // API Params
    const params = {
      language: 'en-US',
      page,
      primary_release_year: year,
      sort_by: 'popularity.desc',
    }
    // console.log("Movies", headers, params, year);
    const moviesResponse: any = await axiosClientService.get("/discover/movie", { headers, params });
    // console.log("Movies", moviesResponse);
    const movies: any = moviesResponse?.data?.results;
    const movieResult: any = await Promise.all(movies.map(async (movie: Movie) => {
      let id: number = movie?.id;
      let editors: string[] = [];
      try {
        // Get credits for each movie by Id
        const creditsResponse: any = await axiosClientService.get(`/movie/${id}/credits`);
        const creditsData: any = creditsResponse?.data?.crew;
        editors = creditsData
          .filter((crewMember: Editor) => crewMember.known_for_department === "Editing")
          .map((editor: Editor) => editor.name);
      } catch (error) {
        // console.error('Error fetching data:', error);
        res.status(500).json({
          error: 'An error occurred while fetching movie data.',
        });
      }
      return {
        title: movie.title || "Unknown Title",
        release_date: movie.release_date || "Unknown Release Date",
        vote_average: movie.vote_average || 0,
        editors,
      };
    })
    );
    res.status(200).json(movieResult);
  } catch (error) {
    // console.error('Error fetching data:', error);
    res.status(500).json({
      error: 'An error occurred while fetching movie data.',
    });
  }
};


export default getMoviesByYear;

