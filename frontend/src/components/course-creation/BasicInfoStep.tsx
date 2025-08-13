import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseData } from "@/pages/CreateCourse";

interface BasicInfoStepProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

const categories = [
  "Web Development",
  "Mobile Development", 
  "Data Science",
  "Design",
  "Business",
  "Marketing",
  "Programming",
  "Other"
];

const levels = [
  "Beginner",
  "Intermediate", 
  "Advanced",
  "All Levels"
];

const BasicInfoStep = ({ data, updateData }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Basic Course Information</h3>
        <p className="text-muted-foreground mb-6">
          Provide the essential details about your course that will help students understand what they'll learn.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Complete React Development Bootcamp"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Choose a clear, descriptive title that tells students exactly what they'll learn.
          </p>
        </div>

        <div>
          <Label htmlFor="description">Course Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what students will learn, the skills they'll gain, and who this course is for..."
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="mt-1 min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Provide a comprehensive description that highlights the key benefits and learning outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={data.category} onValueChange={(value) => updateData({ category: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="level">Difficulty Level *</Label>
            <Select value={data.level} onValueChange={(value) => updateData({ level: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="price">Course Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="29.99"
            value={data.price || ""}
            onChange={(e) => updateData({ price: parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Set your course price. You can always change this later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;