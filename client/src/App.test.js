import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "./App";
import Profile from "./components/Profile";
import StartPage from "./components/StartPage";
import { act } from "react-dom/test-utils";


describe("Start page", () =>{
    it("Start page renders", () =>{
        
        
        const {container} = render(<App></App>)
        expect(container).toMatchSnapshot();
    })
    
    it("Search button redirects to profile with input name", async () =>{
        
        const {container} = render(<App></App>)
        
        // const onChangeMock = jest.fn();
     
        const input = screen.getByPlaceholderText('Name');
        const button = screen.getByRole("button", {name: 'Search!'});
        userEvent.type(input, "wojwoj8");
  
        // have to use act because I've got error with route
        act(() => {
            userEvent.click(button);
        });

       
        const test = screen.getByText('loading...')
        expect(test).toBeInTheDocument()
        // const name = await screen.findByText('wojwoj8');  
        // expect(name).toBeInTheDocument();
    })
    it("Renders Profile", async() =>{
        const handleSearch = jest.fn()
        render(<Profile></Profile>)
        // expect(fetch).toHaveBeenCalledTimes(1);

    })
});

// setup fetch assigning fetch function to global.fetch
describe("Profile component", () => {
    beforeEach(() => {
        //fake data in fetch
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              id: 1,
              accountId: "12345",
              puuid: "abcdef",
              name: "wojwoj8",
              profileIconId: 123,
              revisionDate: "000000001",
              summonerLevel: 2137,
            }),
        })
      );
    });
  
    afterEach(() => {
      global.fetch.mockClear();
      delete global.fetch;
    });
  
    it("renders profile data", async () => {
      render(<Profile />);
  
      await waitFor(() => {
        expect(screen.getByText("ID: 1")).toBeInTheDocument();
        expect(screen.getByText("Account ID: 12345")).toBeInTheDocument();

        
        expect(screen.getByText("Puuid: abcdef")).toBeInTheDocument();
        expect(screen.getByText("Name: wojwoj8")).toBeInTheDocument();
        expect(screen.getByText("Profile Icon ID: 123")).toBeInTheDocument();
        expect(screen.getByText("Revision Date: 000000001")).toBeInTheDocument();
        expect(screen.getByText("Summoner Level: 2137")).toBeInTheDocument();
      });
    });
  });