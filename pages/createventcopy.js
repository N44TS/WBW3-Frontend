import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Alert from "../components/Alert";
import connectContract from "../utils/connectContract";
import getRandomImage from "../utils/getRandomImage";

import Image from 'next/image'
import Spinner from "../components/spinner.gif";
import { getNullableType } from "graphql";

export default function CreateEvent() {
  const { data: account } = useAccount();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [refund, setRefund] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState(null);

  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [eventID, setEventID] = useState(null);

  const [apiFetch, setApiFetch] = useState(null);
  const [trulyMinted, settrulyMinted] = useState(null);

  // const [fileUrl, updateFileUrl] = useState(``);

  // const client = create('https://ipfs.infura.io:5001/api/v0')

  // async function onImageChange(e) {
  //   const file = e.target.files[0]
  //   try {
  //     const added = await client.add(file)
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //     updateFileUrl(url)
  //     console.log("something with ifps is done here")
  //   } catch (error) {
  //     console.log('Error uploading file: ', error)
  //   }  
  // }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("LFG make an event woop!")
    setApiFetch(true);

    const body = {
      name: eventName,
      description: eventDescription,
      link: eventLink,
      image: getRandomImage(),
      //image: eventImage.name
    };

    try {
      const response = await fetch("/api/store-event-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status !== 200) {
        alert("Oops! Something went wrong. Please refresh and try again.");
      } else {
        console.log("Form successfully submitted!");
        let responseJSON = await response.json();
        await createEvent(responseJSON.cid);
        console.log("API has finally returned");
        setTimeout(() => console.log('Initial 15 second timeout!'), 15000);
        setTimeout(() =>  settrulyMinted(true), 16000);
      }
      // check response, if success is false, dont take them to success page
    } catch (error) {
      alert(
        `Oops! Something went wrong. Please refresh and try again. Error ${error}`
      );
    }
  }

  const createEvent = async (cid) => {
    try {
      const rsvpContract = connectContract();

      if (rsvpContract) {
        let deposit = ethers.utils.parseEther(refund);
        let eventDateAndTime = new Date(`${eventDate} ${eventTime}`);
        let eventTimestamp = eventDateAndTime.getTime();
        let eventDataCID = cid;

        const txn = await rsvpContract.createNewEvent(
          eventTimestamp,
          deposit,
          maxCapacity,
          eventDataCID,
          { gasLimit: 900000 }
        );

        setApiFetch(false);
        setLoading(true);
        console.log("Minting...", txn.hash);
        let wait = await txn.wait();
        console.log("Minted -- ", txn.hash);
        setEventID(wait.events[0].args[0]);
        setMessage("Your event has been created successfully.");
        setLoading(false)
        setSuccess(true);
        
      } else {
        console.log("Error getting contract.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`There was an error creating your event: ${error.message}`);
      setLoading(false);
      setApiFetch(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // disable scroll on <input> elements of type number
    document.addEventListener("wheel", (event) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
  });


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Create your event | Sports4Women </title>
        <meta
          name="description"
          content="Create your virtual event on the blockchain"
        />
      </Head>
      <section className="relative py-12">
        {loading && (
          <Alert
            alertType={"loading"}
            alertBody={"Please wait, minting your event"}
            triggerAlert={true}
            color={"white"}
          />
        )}
         {apiFetch && (
          <Alert
          alertType={"loading"}
          alertBody={"Please wait for wallet to pop, this takes a WHILE"}
          triggerAlert={true}
          color={"red"}
          />
        )}
        {
          trulyMinted && (
          <Alert
            alertType={"success"}
            alertBody={"This is the trulyminted setstate"}
            triggerAlert={true}
            color={"blue"}
          />)
        }
        {success && (
          <Alert
            alertType={"success"}
            alertBody={message}
            triggerAlert={true}
            color={"palegreen"}
          />
        )}
        {success === false && (
          <Alert
            alertType={"failed"}
            alertBody={message}
            triggerAlert={true}
            color={"palevioletred"}
          />
        )}
        {!success && (
          <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
            Create your event
          </h1>     
        )}
        {account && !success && (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 divide-y divide-gray-200"
          >
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="eventname"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Event name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    id="event-name"
                    name="event-name"
                    type="text"
                    className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Date & time
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    Your event date and time
                  </p>
                </label>
                <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
                  <div className="w-1/2">
                    <input
                      id="date"
                      name="date"
                      type="date"
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      id="time"
                      name="time"
                      type="time"
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                      required
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="max-capacity"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Max capacity
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    Limit the number of spots available for your event.
                  </p>
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="max-capacity"
                    id="max-capacity"
                    min="1"
                    placeholder="100"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="refundable-deposit"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Refundable deposit
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    Require a refundable deposit (in MATIC) to reserve one spot
                    at your event
                  </p>
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="number"
                    name="refundable-deposit"
                    id="refundable-deposit"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    value={refund}
                    onChange={(e) => setRefund(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="event-link"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Event link
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    The link for your virtual event
                  </p>
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    id="event-link"
                    name="event-link"
                    type="text"
                    className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                  />
                </div>
              </div>

              {/* <div>
                <p>Image here</p>
                <input
                  type="file" accept="image/*"
                  id="event-image"
                  name="event-image"
                  onChange={(e) => setEventImage(e.target.files[0])}
                />
              </div> */}

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Event description
                  <p className="mt-2 text-sm text-gray-400">
                    Let people know what your event is about!
                  </p>
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={10}
                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <Link href="/">
                  <a className="bg-white py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                  </a>
                </Link>

          {apiFetch ? (
          <p className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >Please wait for wallet pop</p>
        ) :
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              }

              </div>
            </div>
          </form>
        )}
        {success && eventID && !trulyMinted && (
          <div>
            <p>Just a litttttle bit longer, this isnt efficicent is it really, needs tidying up</p>
            <Image src={Spinner} alt="loading spinner" height={200} width={200} />
          </div>
        )}
        {
          trulyMinted && eventID && (
            <div>
            Success! Please wait a few minutes (could be like 10), then check out your event{" "}
            <span className="font-bold">
              <Link href={`/event/${eventID}`}>here</Link>
            </span>
          </div>)
        }

        {!account && (
          <section className="flex flex-col items-start py-8">
            <p className="mb-4">Please connect your wallet to create events.</p>
            <ConnectButton />
          </section>
        )}
      </section>
    </div>
  );
}
