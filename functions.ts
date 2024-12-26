export async function getCoordinates(address: string) {
  // Replace spaces with + for URL formatting
  const formattedAddress = encodeURIComponent(address);

  // Get your API key from https://developers.google.com/maps/documentation/geocoding
  const apiKey = "AIzaSyCrfZ8dhPZIDysIUFFMe7rIuyV2pkx1xOg";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: data.results[0].formatted_address,
        success: true,
      };
    } else {
      return {
        error: `Geocoding failed: ${data.status}`,
        success: false,
      };
    }
  } catch (error: any) {
    return {
      error: `Request failed: ${error.message}`,
      success: false,
    };
  }
}
