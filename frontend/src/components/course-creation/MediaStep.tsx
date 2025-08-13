import { useState, useRef } from "react";
import { Upload, Image, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "@/pages/CreateCourse";

interface MediaStepProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

const MediaStep = ({ data, updateData }: MediaStepProps) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [previewVideoPreview, setPreviewVideoPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const previewVideoInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ thumbnail: file });
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ previewVideo: file });
      const reader = new FileReader();
      reader.onload = () => setPreviewVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    updateData({ thumbnail: undefined });
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const removePreviewVideo = () => {
    updateData({ previewVideo: undefined });
    setPreviewVideoPreview(null);
    if (previewVideoInputRef.current) {
      previewVideoInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Course Media</h3>
        <p className="text-muted-foreground mb-6">
          Add visual content to make your course more appealing to students.
        </p>
      </div>

      {/* Course Thumbnail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Course Thumbnail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload an eye-catching thumbnail that represents your course. Recommended size: 1280x720px.
          </p>
          
          {thumbnailPreview ? (
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="Course thumbnail preview"
                className="w-full max-w-md rounded-lg border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={removeThumbnail}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}
          
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => thumbnailInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Video */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Preview Video (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a short preview video to give students a taste of your teaching style and course content.
          </p>
          
          {previewVideoPreview ? (
            <div className="relative">
              <video
                src={previewVideoPreview}
                controls
                className="w-full max-w-md rounded-lg border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={removePreviewVideo}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => previewVideoInputRef.current?.click()}
            >
              <Video className="w-8 h-8 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV up to 100MB
              </p>
            </div>
          )}
          
          <input
            ref={previewVideoInputRef}
            type="file"
            accept="video/*"
            onChange={handlePreviewVideoUpload}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => previewVideoInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {previewVideoPreview ? "Change Preview Video" : "Upload Preview Video"}
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Tips for Great Course Media</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Use high-quality, relevant images that showcase your course topic</li>
            <li>• Keep preview videos short (30-90 seconds) and engaging</li>
            <li>• Ensure your thumbnail is clear and readable even at small sizes</li>
            <li>• Include your course title or key concepts in the thumbnail design</li>
            <li>• Preview videos should highlight the most compelling parts of your course</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaStep;