import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "./App";
import Profile from "./components/Profile";
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
    // beforeEach(() => {
    //     //fake data in fetch
      
    // });
  
    afterEach(() => {
      global.fetch.mockClear();
      delete global.fetch;
    });
  
    it("renders profile data with only soloQ data", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([   {   'accountId': 'U6N7K8xKBhlTuhGHjc8x1R2lNPVp_1_KjswJ5C03x1BRZ3I',
            'iconImg': 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/1441.jpg',
            'id': '15sHGebfqS8Hp757IkX-SP9ixD6ZaIHVS9ZEd49oTbWJo8c',
            'name': 'szykos007',
            'profileIconId': 1441,
            'puuid': '64qKjPJGWX4OQURSluuTl7O4kFmtUYm0_WaTZk3eiD3gN4g_kcXO-xgHNE896SmSQBoZw6QilT1xvA',
            'revisionDate': 1682890719000,
            'summonerLevel': 295},
        [   {   'freshBlood': false,
                'hotStreak': false,
                'inactive': false,
                'leagueId': 'a9ea33da-0d74-4449-b2a0-bfcd57167536',
                'leaguePoints': 0,
                'losses': 59,
                'queueType': 'RANKED_SOLO_5x5',
                'rank': 'IV',
                'summonerId': '15sHGebfqS8Hp757IkX-SP9ixD6ZaIHVS9ZEd49oTbWJo8c',
                'summonerName': 'szykos007',
                'tier': 'GOLD',
                'veteran': false,
                'winrate': 48,
                'wins': 54}]]),
        })
      );
      render(<Profile />);
  
      await waitFor(() => {
        expect(screen.getByText("Name: szykos007")).toBeInTheDocument();
        expect(screen.getByText("Summoner Level: 295")).toBeInTheDocument();
        expect(screen.queryByTestId("solo-unrank")).not.toBeInTheDocument();
        expect(screen.queryByTestId("flex-unrank")).toBeInTheDocument();
      });
    });

    it("renders profile data with soloQ and flex data", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([   {   'accountId': 'Emu1Ji5HNVK2ryFb63Na4Lfo8pt0l55zMct3oTZ5vGXB7g',
            'iconImg': 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/925.jpg',
            'id': 'KPiKAfppp0ZPlQr0KGkgQFRfUwgVqdNncZGu6fsqSXe2tSs',
            'name': 'Piotron 2012',
            'profileIconId': 925,
            'puuid': 'p0iaPw_HXwPI2mWRUyxjAOU_CBKXDECP46XN8xkcnn5sB6szpuuUKhA-JbfzGUef-dBE-l1i68GNOw',
            'revisionDate': 1686172088700,
            'summonerLevel': 413},
        [   {   'freshBlood': false,
                'hotStreak': true,
                'inactive': false,
                'leagueId': '0b0034ac-ac45-4cab-ba01-d3e8990ffee1',
                'leaguePoints': 100,
                'losses': 8,
                'miniSeries': {   'losses': 0,
                                  'progress': 'WNN',
                                  'target': 2,
                                  'wins': 1},
                'queueType': 'RANKED_FLEX_SR',
                'rank': 'I',
                'summonerId': 'KPiKAfppp0ZPlQr0KGkgQFRfUwgVqdNncZGu6fsqSXe2tSs',
                'summonerName': 'Piotron 2012',
                'tier': 'GOLD',
                'veteran': false,
                'winrate': 70,
                'wins': 18},
            {   'freshBlood': false,
                'hotStreak': false,
                'inactive': false,
                'leagueId': 'e7493ebb-7640-40f4-84c6-46f469bc914d',
                'leaguePoints': 29,
                'losses': 81,
                'queueType': 'RANKED_SOLO_5x5',
                'rank': 'II',
                'summonerId': 'KPiKAfppp0ZPlQr0KGkgQFRfUwgVqdNncZGu6fsqSXe2tSs',
                'summonerName': 'Piotron 2012',
                'tier': 'PLATINUM',
                'veteran': false,
                'winrate': 50,
                'wins': 80}]]),
        })
      );
      render(<Profile />);
  
      await waitFor(() => {
        expect(screen.getByText("Name: Piotron 2012")).toBeInTheDocument();
        expect(screen.getByText("Summoner Level: 413")).toBeInTheDocument();
        expect(screen.queryByTestId("solo-unrank")).not.toBeInTheDocument();
        expect(screen.queryByTestId("flex-unrank")).not.toBeInTheDocument();

      });
    });


    it("renders profile without soloQ and flex data", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([   {   'accountId': 'vLG_KyqyOYqlQr-8LJ_bfK9oUmplo8TGBZeSsNCkvoJaTP8',
            'iconImg': 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/3015.jpg',
            'id': 'XZvVY24bu-Kmoi3Ho-FHvw7ySixvRSsiG8m0kskgTYg66IM',
            'name': 'wojwoj88',
            'profileIconId': 3015,
            'puuid': '8J9eU1ljqJZMcoiGFiVTq8yOS9dsC2PD-lnQA5MbCXTT_ryaFWwu6lrvIKjXOpdqD75hDP7LNaxg3Q',
            'revisionDate': 1558603866000,
            'summonerLevel': 24},
        []]),
        })
      );
      render(<Profile />);
  
      await waitFor(() => {
        expect(screen.getByText("Name: wojwoj88")).toBeInTheDocument();
        expect(screen.getByText("Summoner Level: 24")).toBeInTheDocument();
        expect(screen.queryByTestId("solo-unrank")).toBeInTheDocument();
        expect(screen.queryByTestId("flex-unrank")).toBeInTheDocument();

      });
    });
  });