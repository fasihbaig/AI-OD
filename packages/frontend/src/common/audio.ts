/**
 * 
 * @param blob 
 * @returns 
 */
export function convertBlobToAudio(blob: Blob): string {
    const audio = new Audio();
    return URL.createObjectURL(blob);
}