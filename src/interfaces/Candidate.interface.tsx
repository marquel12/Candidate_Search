// TODO: Create an interface for the Candidate objects returned by the API



interface Candidate {
    avatar_url: string;
    name?: string; // the ? means this property is optional
    login: string;
    location?: string;
    email?: string;
    html_url: string;
    company?: string;
    bio?: string;
   
  
   
}


export default Candidate;