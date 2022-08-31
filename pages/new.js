import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import Link from "next/link";
import EventCard2 from "../components/EventCard2";


const FEED_SEARCH_QUERY = gql`
  query Events ($filter: String!)   {
    events (where: { name_contains: $filter }) {
      id
      eventID
      name
      description
    }
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery( FEED_SEARCH_QUERY);
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter }
            })
          } >
          OK
        </button>
      </div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      ></ul>
      {data &&
        data.events.map((event) => (
          <li key={event.id} >
          <EventCard2
          name={event.name}
          id={event.id}
          eventTimestamp={event.eventTimestamp}
          imageURL={event.imageURL} 
          />
          </li>
        ))}
    </>
  );
};

export default Search;