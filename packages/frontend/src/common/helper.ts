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