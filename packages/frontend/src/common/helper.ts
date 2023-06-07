/**
 * 
 * @param value 
 * @param inMin 
 * @param inMax 
 * @param outMin 
 * @param outMax 
 * @returns 
 */
export function scaleValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    // Calculate the input and output ranges
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
  
    // Scale the value to the output range
    const scaledValue = (value - inMin) * (outRange / inRange) + outMin;
  
    return scaledValue;
}

/**
 * 
 * @param inputFile 
 * @returns 
 */
export function convertFileToBase64Promise(inputFile: Blob): Promise<{data: string, name: string}> {
  return new Promise((resolve, reject) => {
    if (!inputFile) {
      return reject(new Error("No valid file was provided"));
    }

    let base64documentString: string;
    const reader = new FileReader();
    reader.readAsDataURL(inputFile);

    const resultantFile: {data: string, name: string, type: string} = {
      name: "n/a",
      data: "",
      type: inputFile.type
    };

    reader.addEventListener("load", (event: ProgressEvent) => {
      const binaryString = (event.target as FileReader).result as ArrayBuffer;
      //if(reader.result)
      base64documentString = reader.result as string; // (reader.result as string).split(',')[1]; //btoa(binaryString.toString());
    });

    reader.onloadend = (): void => {
      resultantFile.data = base64documentString;
      resultantFile.name = inputFile.name;
      return resolve(resultantFile);
    };

    reader.addEventListener("error", (error): void => {
      return reject(error);
    });
  });
}