import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import Link from "next/link";
import SearchEventCard from "../components/SearchEventCard";

//helpful sites to reference https://thegraph.com/docs/en/release-notes/assemblyscript-migration-guide/
// https://www.howtographql.com/react-apollo/7-filtering-searching-the-list-of-links/

const FEED_SEARCH_QUERY = gql`
  query Events ($filter: String!)   {
    events (where: { name_contains: $filter }) {
      id
      name
      eventTimestamp
      imageURL
    }
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery( FEED_SEARCH_QUERY);
  return (
    <> 
      <div className="ml-10 space-x-4 flex float-right">
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />

        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 border border-indigo-100 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter }
            })
          } >
          Search events
        </button>
        {!data && searchFilter &&
        <h3>No event found</h3> 
          }
      </div>

      <div >
      <ul
        role="list"
        className="mt-50 grid sm:grid-cols-3 sm:gap-x-6"
      >
      {data &&       
        data.events.map((event) => (
          <li key={event.id} >
          <SearchEventCard
          name={event.name}
          id={event.id}
          eventTimestamp={event.eventTimestamp}
          imageURL={event.imageURL} 
          />
          </li>
        ))} 
        </ul>
        </div>

    </>
  );
};

export default Search;