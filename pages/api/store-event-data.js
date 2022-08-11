import { Web3Storage, File, getFilesFromPath } from "web3.storage";
const { resolve } = require("path");

export default async function handler(req, res) {
    if (req.method === "POST") {
      return await storeEventData(req, res);
    } else {
      return res
        .status(405)
        .json({ message: "Method not allowed", success: false });
    }
  }

  async function storeEventData(req, res) {
    const body = req.body;
    try {
      const files = await makeFileObjects(body); //create a json file that includes metadata passed from the req.body object
      const cid = await storeFiles(files); //store that json file to Web3.storage.
      return res.status(200).json({ success: true, cid: cid });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error creating event", success: false });
    }
  }

  async function makeFileObjects(body) {
    const buffer = Buffer.from(JSON.stringify(body));
  
    const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`); //look up the image 
    const files = await getFilesFromPath(imageDirectory); //get the image from our images folder. his will return the image in an array, so we can push our data file to this array so we can upload both the image and the event data at the same time
  
    files.push(new File([buffer], "data.json")); //create a new File from the buffer which we can name "data.json", and then push this to the files array
    return files;
  }
 
  //need to create a Web3Storage client object to interact with.
  function makeStorageClient() {
    return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
  }

  // Once we have created our Web3Storage client, we can call put method on the client to upload our array of files.
  async function storeFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid;
  }
