import fs from "fs";

/**
 * 
 * @param path 
 */
export const convertFileToBase64 = (path: string) => {
    return new Promise(( resolve, reject) => {  
        // Read audio file
        fs.readFile(path, (err: Error | null, data: Buffer) => {
            if (err) {
                reject(err)
                console.error(err);
                return;
            }
        
            // Convert audio data to base64 string
            resolve(data.toString('base64'));
        });
    })
}