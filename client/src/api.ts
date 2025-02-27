
export async function convertMarkdown(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.markdown;
  } catch (error) {
    console.error("Error in convertMarkdown:", error);
    throw error;
  }
}
