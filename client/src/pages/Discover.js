import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useAuth } from "../components/UserContext";
import DiscoveryCard from "../components/DiscoveryCard";

export default function Discover() {
  const { authTokens, setAuthTokens } = useAuth();
  const [user] = useState(authTokens ? authTokens.user : null);
  //get a list of all open contests
  //display a list of all open contests
  const [list, setList] = useState([
    {
      creation_date: "2020-05-28T22:15:32.428Z",
      _id: "5ed038ee2837b433c68b5c4e",
      title: "Tiger Tattoo Contest",
      description: "I'm interested in a roaring tiger on my back. ",
      prize_amount: 599,
      deadline_date: "2020-06-30T22:18:26.061Z",
      user_id: "5ed038402837b433c68b5c4d",
      name: "Tom",
      profile_image_url: "",
      firstImage: "",
      tags: [""],
    },
  ]);

  useEffect(() => {
    fetch("/api/contests/discover")
      .then((res) => res.json())
      .then((_list) => {
        console.log(_list);
        setList(_list.contests);
      })
      .catch((e) => console.log(e));
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!user ? (
          <Typography
            style={{
              margin: "1rem 0.5rem",
              textAlign: "center",
            }}
            variant="h6"
          >
            The platform for tattoo pros & fans. <br />
            Find ideas, start a contest, get ink!
          </Typography>
        ) : null}
        <Typography variant="h1">Open Contests</Typography>
      </div>

      {list.map((contest) => {
        return (
          <a
            style={{ textDecoration: "none" }}
            href={`/contest/${contest._id}`}
          >
            <DiscoveryCard
              key={contest._id}
              deadline_date={contest.deadline_date}
              title={contest.title}
              description={contest.description}
              prize_amount={contest.prize_amount}
              name={contest.name}
              profile_image_url={contest.profile_image_url}
              firstImage={contest.firstImage}
              tags={contest.tags}
            />
          </a>
        );
      })}
    </div>
  );
}
