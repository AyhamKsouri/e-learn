import { useState } from "react";
import { Plus, Trash2, GripVertical, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CourseData } from "@/pages/CreateCourse";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface CurriculumStepProps {
  data: CourseData;
  updateData: (data: Partial<CourseData>) => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl?: string;
  resources?: File[];
}

const CurriculumStep = ({ data, updateData }: CurriculumStepProps) => {
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState<Lesson>({
    id: "",
    title: "",
    description: "",
    duration: 0
  });

  const addLesson = () => {
    if (!newLesson.title) return;
    
    const lesson = {
      ...newLesson,
      id: Date.now().toString()
    };
    
    updateData({ lessons: [...data.lessons, lesson] });
    setNewLesson({ id: "", title: "", description: "", duration: 0 });
    setIsAddingLesson(false);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    const updatedLessons = data.lessons.map(lesson =>
      lesson.id === id ? { ...lesson, ...updates } : lesson
    );
    updateData({ lessons: updatedLessons });
  };

  const deleteLesson = (id: string) => {
    const updatedLessons = data.lessons.filter(lesson => lesson.id !== id);
    updateData({ lessons: updatedLessons });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedLessons = Array.from(data.lessons);
    const [reorderedItem] = reorderedLessons.splice(result.source.index, 1);
    reorderedLessons.splice(result.destination.index, 0, reorderedItem);

    updateData({ lessons: reorderedLessons });
  };

  const totalDuration = data.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
        <p className="text-muted-foreground mb-6">
          Add and organize your lessons. Students will see them in this order.
        </p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {data.lessons.length}
              </div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Lessons</h4>
          <Dialog open={isAddingLesson} onOpenChange={setIsAddingLesson}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input
                    id="lesson-title"
                    placeholder="e.g., Introduction to React Components"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-description">Description</Label>
                  <Textarea
                    id="lesson-description"
                    placeholder="Brief description of what this lesson covers..."
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                  <Input
                    id="lesson-duration"
                    type="number"
                    placeholder="15"
                    value={newLesson.duration || ""}
                    onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingLesson(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addLesson} disabled={!newLesson.title}>
                    Add Lesson
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {data.lessons.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first lesson to build your course curriculum.
              </p>
              <Button onClick={() => setIsAddingLesson(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Lesson
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {data.lessons.map((lesson, index) => (
                    <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="hover:shadow-[var(--shadow-medium)] transition-all duration-300"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div
                                {...provided.dragHandleProps}
                                className="text-muted-foreground hover:text-foreground cursor-grab"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="font-medium">{lesson.title}</h5>
                                    {lesson.description && (
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <span className="text-sm text-muted-foreground">
                                      {lesson.duration} min
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteLesson(lesson.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default CurriculumStep;