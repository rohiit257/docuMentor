"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Upload, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateDocumentation } from "@/lib/services/ai";
import ReactMarkdown from "react-markdown"; // Install this library if not already installed
import remarkGfm from "remark-gfm"; // For GitHub-flavored Markdown (optional)

interface Project {
  id: string;
  name: string;
  domain: string | null;
  documentation: string
  is_deployed: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast.error("Failed to fetch project details");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Read the JSON file as text
      const content = await file.text();

      // Generate AI-powered documentation
      const documentation = await generateDocumentation({
        name: project?.name || "API Documentation",
        description: project?.domain || "",
        endpoints: content, // Pass the entire JSON content as text
      });

      // Save the generated documentation in Supabase
      await supabase.from("projects").update({ documentation }).eq("id", params.id);

      toast.success("API documentation generated successfully!");
      fetchProject(); // Refresh project to display the documentation
    } catch (error: any) {
      toast.error(error.message || "Failed to upload and process the file");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select("documentation")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      if (!projectData?.documentation) {
        toast.error("No documentation available");
        return;
      }

      const blob = new Blob([projectData.documentation], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "api"}-documentation.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download documentation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Project not found</CardTitle>
            <CardDescription>
              The project you're looking for doesn't exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.domain || "No domain set"}</p>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">API Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload JSON File</CardTitle>
              <CardDescription>
                Upload a JSON file to generate API documentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="collection">JSON File</Label>
                  <Input
                    id="collection"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
                {uploading && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Uploading and processing file...
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {project.documentation && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Documentation</CardTitle>
                <CardDescription>
                  The documentation for your API has been generated. You can download it below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100  text-black p-4 rounded overflow-auto text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.documentation}
                  </ReactMarkdown>
                </div>
                <Button variant="outline" className="mt-4" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Documentation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}