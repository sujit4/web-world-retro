
import { useState } from "react";
import { convertMarkdown } from "./api";
import { Toaster, toast } from "sonner";
import { ArrowRight, FileText, Upload, Check, Copy, Download } from "lucide-react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedMarkdown, setConvertedMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setConvertedMarkdown("");
    }
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    try {
      const result = await convertMarkdown(file);
      setConvertedMarkdown(result);
      toast.success("File converted successfully!");
    } catch (error) {
      console.error("Error converting file:", error);
      toast.error("Failed to convert file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(convertedMarkdown);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([convertedMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? `${file.name.split(".")[0]}.md` : "converted.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded markdown file!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-accent/5 p-4 md:p-8">
      <Toaster position="top-right" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Office to Markdown Converter
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert your Word documents (.docx) to clean, well-formatted Markdown files
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FileText className="text-primary" size={20} />
              Input Document
            </h2>
            
            <div className="mb-4">
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md cursor-pointer bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Word documents (.docx)
                  </p>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".docx" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
            
            {file && (
              <div className="p-3 bg-accent/10 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="text-primary mr-2" size={16} />
                  <span className="text-sm font-medium truncate max-w-[180px]">{file.name}</span>
                </div>
                <Check className="text-primary" size={16} />
              </div>
            )}
            
            <button 
              onClick={handleConvert} 
              disabled={!file || loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Convert to Markdown
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FileText className="text-primary" size={20} />
              Markdown Output
            </h2>
            
            <div className="relative">
              <pre className="w-full h-64 bg-accent/5 border border-border rounded-md p-4 overflow-auto whitespace-pre-wrap text-sm">
                {convertedMarkdown || "Your markdown will appear here..."}
              </pre>
              
              {convertedMarkdown && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button 
                    onClick={handleCopyToClipboard}
                    className="p-1.5 rounded-md bg-background/80 hover:bg-background text-foreground border border-border backdrop-blur-sm transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-1.5 rounded-md bg-background/80 hover:bg-background text-foreground border border-border backdrop-blur-sm transition-colors"
                    title="Download as file"
                  >
                    <Download size={14} />
                  </button>
                </div>
              )}
            </div>
            
            {convertedMarkdown && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Your document has been converted successfully!
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Upload Word documents to convert them into clean Markdown format for easier content editing
          </p>
        </div>
      </div>
    </main>
  );
}
