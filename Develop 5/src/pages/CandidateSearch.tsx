import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import Candidate  from "../interfaces/Candidate.interface";

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]); // this will be an array of Candidate objects
  const [loading, setLoading] = useState<boolean>(true); // the loading variable will be used to display a loading message while the data is being fetched

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const randomCandidates = await searchGithub();
        if (randomCandidates.length > 0) { // check if the randomCandidates array is not empty
          const candidateInfo = await Promise.all(
            randomCandidates.map(async (candidate: Candidate) => {
              // get more info for each candidate
              const details = await searchGithubUser(candidate.login);
              return { ...candidate, ...details }; // return a new object with the candidate details and the additional details
            })
          );
          setCandidates(candidateInfo); // set the state variable to the array of Candidate objects returned by the API
          setLoading(false); // set loading to false once the data has been fetched

        }

    };
    fetchCandidates(); /// call the fetchCandidates function when the component mounts to fetch the data
  }, []); // the empty array means this effect will only run once, after the initial render

  const handleSkipCandidate = () => {
    setCandidates(candidates.slice(1)); // remove the first candidate from the array
  };

  //save candidate to local storage and skip to next candidate

  const saveCandidates = (candidate: Candidate) => {
    try {
      const savedCandidates = JSON.parse(
        localStorage.getItem("savedCandidates") || "[]"
      ); // this is saying  get the savedCandidates from local storage or return an empty array if there are no savedCandidates`
      savedCandidates.push(candidate); // add the candidate to the savedCandidates array
      localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates)); // save the updated savedCandidates array back to local storage
      console.log("Candidate saved", candidate);
    } catch (err) {
      console.error("An error occurred", err);
    }
    // skip to the next candidate
    handleSkipCandidate();
  };

  if (loading) {
    return <p>Loading Candidate...</p>;
  }

  return (
    <div className="candidate-container">
      <h1>CandidateSearch</h1>
      {candidates.length > 0 ? (
        <div>
          <div className="candidate-card">
            <div className="avatar"></div>
            <img
              src={candidates[0].avatar_url}
              alt={candidates[0].name || candidates[0].login}
              className="candidate-avatar"
            />
            <div className="candidate-info">
              <h2>{candidates[0].name || candidates[0].login}</h2>
              <p>Username: {candidates[0].login}</p>
              <p>Location: {candidates[0].location}</p>
              <p>Email: {candidates[0].email}</p>
              <p>Company: {candidates[0].company}</p>
              <p>Bio: {candidates[0].bio}</p>
              <a href={candidates[0].html_url} target="_blank" rel="noreferrer">
                View Profile
              </a>
            </div>
          </div>

          <div className="button-container">
            <button className="minus" onClick={handleSkipCandidate}
            style={{ 
              backgroundColor: "red",
              color: "white",
            marginTop: "10px",
          fontSize: "30px",}}
          >
              -
            </button>
            <button
              className="minus"
              onClick={() => saveCandidates(candidates[0])}
              style={{ 
                backgroundColor: "green",
                color: "white",
              marginTop: "10px",
            fontSize: "30px",
         }}
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <p>No more candidates to show</p>
      )}
    </div>
  );
};

export default CandidateSearch;
