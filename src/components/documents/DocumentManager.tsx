
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { FileUp, File, Trash2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock database for documents
const MOCK_DOCUMENTS = [
  {
    id: "doc1",
    name: "Blood Test Results - June 2023.pdf",
    uploadedBy: "Dr. Jane Smith",
    uploadedById: "d1",
    uploadDate: "2023-06-15T10:30:00Z",
    type: "lab_result",
    size: 2.4,
    shared: ["p1"],
    thumbnailUrl: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: "doc2",
    name: "Prescription - Antibiotics.pdf",
    uploadedBy: "Dr. Jane Smith",
    uploadedById: "d1",
    uploadDate: "2023-06-20T14:45:00Z",
    type: "prescription",
    size: 0.8,
    shared: ["p1"],
    thumbnailUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "doc3",
    name: "MRI Scan Report.pdf",
    uploadedBy: "General Hospital",
    uploadedById: "h1",
    uploadDate: "2023-07-05T09:15:00Z",
    type: "imaging",
    size: 5.6,
    shared: ["p1", "d1"],
    thumbnailUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "doc4",
    name: "Allergy Test Results.pdf",
    uploadedBy: "John Doe",
    uploadedById: "p1",
    uploadDate: "2023-07-10T16:20:00Z",
    type: "lab_result",
    size: 1.2,
    shared: ["d1"],
    thumbnailUrl: "https://i.pravatar.cc/150?img=13",
  },
];

const DocumentManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-documents");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentList, setDocumentList] = useState(MOCK_DOCUMENTS);

  // Filter documents based on user role and active tab
  const getFilteredDocuments = () => {
    if (!user) return [];
    
    if (activeTab === "my-documents") {
      return documentList.filter(doc => {
        if (user.role === "patient") {
          return doc.uploadedById === user.id || doc.shared.includes(user.id);
        } else {
          return doc.uploadedById === user.id;
        }
      });
    } else {
      // Shared with me tab
      return documentList.filter(doc => {
        return doc.shared.includes(user.id) && doc.uploadedById !== user.id;
      });
    }
  };

  const filteredDocuments = getFilteredDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    setUploadingFile(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new document in our mock database
    const newDocument = {
      id: `doc${documentList.length + 1}`,
      name: selectedFile.name,
      uploadedBy: user.name,
      uploadedById: user.id,
      uploadDate: new Date().toISOString(),
      type: selectedFile.type.includes('pdf') ? 'document' : 
             selectedFile.type.includes('image') ? 'imaging' : 'other',
      size: selectedFile.size / (1024 * 1024), // Convert to MB
      shared: [],
      thumbnailUrl: user.profilePicture || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    
    setDocumentList([newDocument, ...documentList]);
    setSelectedFile(null);
    setUploadingFile(false);
    
    toast({
      title: "File uploaded successfully",
      description: `${selectedFile.name} has been uploaded to your documents.`,
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocumentList(documentList.filter(doc => doc.id !== documentId));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your records.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'lab_result': return 'Lab Result';
      case 'prescription': return 'Prescription';
      case 'imaging': return 'Imaging';
      case 'document': return 'Document';
      default: return 'Other';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-medical-800">Document Management</h2>
        <p className="text-muted-foreground">Upload, view, and share medical documents securely</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-documents">My Documents</TabsTrigger>
              <TabsTrigger value="shared-with-me">Shared With Me</TabsTrigger>
            </TabsList>
            <TabsContent value="my-documents" className="space-y-4 mt-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground">You haven't uploaded any documents yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map(doc => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-20 bg-gray-100 flex items-center justify-center p-4">
                          <File className="h-10 w-10 text-medical-400" />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{doc.name}</h3>
                              <div className="flex space-x-3 mt-1">
                                <span className="text-xs bg-medical-100 text-medical-800 px-2 py-1 rounded">
                                  {getDocumentTypeLabel(doc.type)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {doc.size.toFixed(1)} MB
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Uploaded on {formatDate(doc.uploadDate)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="shared-with-me" className="space-y-4 mt-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground">No documents have been shared with you yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map(doc => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-20 bg-gray-100 flex items-center justify-center p-4">
                          <File className="h-10 w-10 text-medical-400" />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{doc.name}</h3>
                              <div className="flex items-center mt-1">
                                <Avatar className="h-5 w-5 mr-2">
                                  <AvatarImage src={doc.thumbnailUrl} />
                                  <AvatarFallback className="text-xs">
                                    {doc.uploadedBy.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600">
                                  Shared by {doc.uploadedBy}
                                </span>
                              </div>
                              <div className="flex space-x-3 mt-1">
                                <span className="text-xs bg-medical-100 text-medical-800 px-2 py-1 rounded">
                                  {getDocumentTypeLabel(doc.type)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {doc.size.toFixed(1)} MB
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Share medical records, prescriptions, or test results securely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileUp className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                
                {selectedFile && (
                  <div className="text-sm p-3 bg-gray-50 rounded border">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  disabled={!selectedFile || uploadingFile}
                  onClick={handleUpload}
                >
                  {uploadingFile ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
