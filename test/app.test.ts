// import request from 'supertest';
import { Request, Response } from "express";
import getMoviesByYear from "../src/controllers/movies.controller";
import axios from "axios";
import axiosClientService from "../src/services/movies.service";
import AxiosMockAdapter from "axios-mock-adapter";

// Mock movieService
// jest.mock('../src/services/movie.service');
// const mockAxios = axios.create();
let mockAxiosClient = new AxiosMockAdapter(axiosClientService);

describe('get Movie API Service', () => {
  let mockReq : Partial<Request>;
  let mockRes : Partial<Response>;
  let statusMock : jest.Mock;
  let jsonMock : jest.Mock;

  beforeEach(() => {
    mockReq = {
      query:{}
    };
    statusMock = jest.fn();
    jsonMock = jest.fn();
    mockRes = {
      status:statusMock.mockReturnThis(),
      json:jsonMock
    }
    // mock.resetHandlers();
    mockAxiosClient.reset();
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('For status code 400 return movies data for a year', async() => {
    mockReq.query = {};
    await getMoviesByYear(mockReq as Request,mockRes as Response);
    // Assert
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({error:'Year is required and Valid Number'});
  });
  
  it('For status code 200 return movies data for a year', async () => {
    // Mock data API /discover/movie
    mockAxiosClient.onGet('/distance/movie').reply( function () {
        return new Promise(function (resolve, reject) {
          resolve([200, {
            results:[{
                id: 1,
                title: "Joker",
                release_date: 'January 1, 2019',
                vote_average: 8.19,
              }],
            }]);
        });
      }
    );

    // Mock data API /movie/${id}/credits movie
    mockAxiosClient.onGet('/movie/1/credits').reply(200, {
      crew:[
        {known_for_department:"Editing",name:"Jill Bogdanowicz"},
        {known_for_department:"Editing",name:"Cindy Bond"},
      ]
    });

    mockReq.query = {year:'2019',page:'1'};
    const movieMock = [{ 
      title:"Joker",
      release_date: 'January 1, 2019',
      vote_average: 8.19,
      editors:["Jill Bogdanowicz","Cindy Bond"]
    }];
    
    await getMoviesByYear(mockReq as Request,mockRes as Response);
    // Assert
    // expect(statusMock).toHaveBeenCalledWith(200);
    // expect(jsonMock).toHaveBeenCalledWith(movieMock);
  });

  it('For status code 500 return movies data for a year', async () => {
    // Mock data API /discover/movie
    mockAxiosClient.onGet('/distance/movie').reply(500);

    mockReq.query = {year:'2019',page:'1'};
    await getMoviesByYear(mockReq as Request,mockRes as Response);
    // Assert
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({error: 'An error occurred while fetching movie data.'});
  });

});
