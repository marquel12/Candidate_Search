// import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Candidate  from '../interfaces/Candidate.interface';
import { searchGithubUser } from '../api/API';


const SavedCandidates = () =>{
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);




useEffect(() => {
  const fetchSavedCandidates = async () => {
    const savedCandidatesData = JSON.parse(localStorage.getItem('savedCandidates') || '[]');

    const updatedCandidates: Candidate[] = []; // this will be an array of Candidate objects
    setLoading(true);

    try{
      for (const savedCandidate of savedCandidatesData){
        const updatedCandidate = await searchGithubUser(savedCandidate.login);
          if (updatedCandidate && updatedCandidate.login) { // check if the randomCandidates array is not empty
            updatedCandidates.push(updatedCandidate);
          }
        }
        setSavedCandidates(updatedCandidates);
      } catch (error) {
        setError("Error fetching saved candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCandidates();
  } , []);

  const removeSavedCandidate = async (login:string) =>{
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.login !== login);
      setSavedCandidates(updatedCandidates);
      localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates))

    
  }

  return (
    <div className="container">
      <h1>Potential Candidates</h1>

      {loading ? (
        <h1 className="load">Loading...</h1>
      ) : error ? (
        <h1 className="error">{error}</h1>
      ) : savedCandidates.length > 0 ? (
        <table className="tables">
          <thead>
            <tr style={{
              color: "yellow",
            }}>
              <th>Avatar</th>
              <th>Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate) => (
              <tr key={candidate.login}>
                <td>
                  <img
                    className="table-avatar"
                    src={candidate.avatar_url}
                    alt={candidate.login}
                    style={{
                      width: "200px",
                      height: "150px",
                      borderRadius: "10%",
                     
                    }}
                  />
                </td>
                <td>
                  <a href={candidate.html_url} target="_blank" rel="noreferrer">
                    {candidate.name || candidate.login}
                  </a>
                </td>
                <td>{candidate.location || "Location not provided"}</td>
                <td>{candidate.email || "Email not provided"}</td>
                <td>{candidate.company || "Company not provided"}</td>
                <td>{candidate.bio || "Bio not provided"}</td>
                <td>
                  <button
                
                    onClick={() => removeSavedCandidate(candidate.login)}
                    className="remove"
                    style={
                    {
                        backgroundColor: "red",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "30px",
                        borderRadius: "5px",
                       
                    }
                    }
                  >
                    -
                   
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>No saved candidates yet...</h3>
      )}
    </div>
  );
}









export default SavedCandidates;
