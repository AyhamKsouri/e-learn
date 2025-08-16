import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { coursesAPI, Course, CourseFilters } from "@/api/courses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const { t } = useTranslation();

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await coursesAPI.getAll({
        ...filters,
        search: searchQuery || undefined
      });
      
      setCourses(response.courses);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when filters or search changes
  useEffect(() => {
    fetchCourses();
  }, [filters, searchQuery]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setSearchQuery("");
  };

  // Get available categories and levels
  const categories = coursesAPI.getCategories();
  const levels = coursesAPI.getLevels();

  if (loading && courses.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Helmet>
        <title>{t("courses.meta.title")}</title>
        <meta name="description" content={t("courses.meta.description") as string} />
        <link rel="canonical" href="/courses" />
      </Helmet>

      <section className="mb-8">
        <h1 className="text-3xl font-semibold">{t("courses.heading")}</h1>
        <p className="text-muted-foreground">{t("courses.subheading")}</p>
        {total > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {total} course{total !== 1 ? 's' : ''} available
          </p>
        )}
      </section>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("courses.searchPlaceholder") as string}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) => handleFilterChange('category', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <Select
                  value={filters.level || ""}
                  onValueChange={(value) => handleFilterChange('level', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="enrolled">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <>
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found matching your criteria.</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && courses.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading more courses...</span>
        </div>
      )}
    </div>
  );
}
