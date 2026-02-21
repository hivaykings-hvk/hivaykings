<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionComment;
use App\Models\RoadRatingComment;
use App\Models\Travelogue;
use App\Models\TravelogueComment;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Check if user is admin or chief
     */
    private function isAdmin(): bool
    {
        return auth()->check() && in_array(auth()->user()->role, ['admin', 'chief']);
    }

    /**
     * Get dashboard statistics for admin
     */
    public function getDashboardStats()
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            // Count reported questions
            $reportedQuestionsCount = Question::where('abuse_reported', '>', 0)->count();

            // Count reported question comments/replies (including nested)
            $reportedQuestionCommentsCount = QuestionComment::where('abuse_reported', '>', 0)->count();

            // Count reported road rating comments (including nested)
            $reportedRoadRatingCommentsCount = RoadRatingComment::where('abuse_reported', '>', 0)->count();

            // Count reported travelogues
            $reportedTraveloguesCount = Travelogue::where('abuse_reported', '>', 0)->count();

            // Count reported travelogue comments/replies (including nested)
            $reportedTravelogueCommentsCount = TravelogueComment::where('abuse_reported', '>', 0)->count();

            return response()->json([
                'data' => [
                    'reported_questions' => $reportedQuestionsCount,
                    'reported_question_comments' => $reportedQuestionCommentsCount,
                    'reported_road_rating_comments' => $reportedRoadRatingCommentsCount,
                    'reported_travelogues' => $reportedTraveloguesCount,
                    'reported_travelogue_comments' => $reportedTravelogueCommentsCount,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin dashboard stats error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching dashboard statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reported questions with pagination
     */
    public function getReportedQuestions(Request $request)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $perPage = $request->query('per_page', 20);
            $perPage = in_array($perPage, [20, 30, 50, 100]) ? $perPage : 20;

            $questions = Question::where('abuse_reported', '>', 0)
                ->with('user:id,first_name,last_name')
                ->orderByDesc('created_at')
                ->paginate($perPage);

            return response()->json([
                'data' => $questions->items(),
                'pagination' => [
                    'total' => $questions->total(),
                    'per_page' => $questions->perPage(),
                    'current_page' => $questions->currentPage(),
                    'last_page' => $questions->lastPage(),
                    'from' => $questions->firstItem(),
                    'to' => $questions->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Get reported questions error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching reported questions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete (soft delete) a reported question
     */
    public function deleteQuestion($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $question = Question::findOrFail($id);

            // Soft delete the question
            $question->delete();

            return response()->json([
                'message' => 'Question deleted successfully',
                'data' => $question,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Question not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Delete question error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting question',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reported question comments with pagination
     */
    public function getReportedQuestionComments(Request $request)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $perPage = $request->query('per_page', 20);
            $perPage = in_array($perPage, [20, 30, 50, 100]) ? $perPage : 20;

            $comments = QuestionComment::where('abuse_reported', '>', 0)
                ->with('user:id,first_name,last_name')
                ->orderByDesc('created_at')
                ->paginate($perPage);

            return response()->json([
                'data' => $comments->items(),
                'pagination' => [
                    'total' => $comments->total(),
                    'per_page' => $comments->perPage(),
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                    'from' => $comments->firstItem(),
                    'to' => $comments->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Get reported question comments error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching reported question comments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete (soft delete) a reported question comment
     */
    public function deleteQuestionComment($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $comment = QuestionComment::findOrFail($id);

            // Soft delete the comment
            $comment->delete();

            return response()->json([
                'message' => 'Comment deleted successfully',
                'data' => $comment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Delete question comment error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting comment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Discard reported flag from a question
     */
    public function discardQuestion($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $question = Question::findOrFail($id);

            // Clear abuse_reported flag
            $question->update(['abuse_reported' => 0]);

            return response()->json([
                'message' => 'Question report discarded successfully',
                'data' => $question,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Question not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Discard question report error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error discarding question report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Discard reported flag from a question comment
     */
    public function discardQuestionComment($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $comment = QuestionComment::findOrFail($id);

            // Clear abuse_reported flag
            $comment->update(['abuse_reported' => 0]);

            return response()->json([
                'message' => 'Comment report discarded successfully',
                'data' => $comment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Discard comment report error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error discarding comment report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reported road rating comments with pagination
     */
    public function getReportedRoadRatingComments(Request $request)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $perPage = $request->query('per_page', 20);
            $perPage = in_array($perPage, [20, 30, 50, 100]) ? $perPage : 20;

            $comments = RoadRatingComment::where('abuse_reported', '>', 0)
                ->with('user:id,first_name,last_name', 'roadRating:id,from_city,to_city')
                ->orderByDesc('created_at')
                ->paginate($perPage);

            return response()->json([
                'data' => $comments->items(),
                'pagination' => [
                    'total' => $comments->total(),
                    'per_page' => $comments->perPage(),
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                    'from' => $comments->firstItem(),
                    'to' => $comments->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Get reported road rating comments error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching reported road rating comments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete (soft delete) a reported road rating comment
     */
    public function deleteRoadRatingComment($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $comment = RoadRatingComment::findOrFail($id);

            // Soft delete the comment
            $comment->delete();

            return response()->json([
                'message' => 'Road rating comment deleted successfully',
                'data' => $comment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Delete road rating comment error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting road rating comment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Discard reported flag from a road rating comment
     */
    public function discardRoadRatingComment($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $comment = RoadRatingComment::findOrFail($id);

            // Clear abuse_reported flag
            $comment->update(['abuse_reported' => 0]);

            return response()->json([
                'message' => 'Road rating comment report discarded successfully',
                'data' => $comment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Discard road rating comment report error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error discarding road rating comment report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reported travelogue comments with pagination
     */
    public function getReportedTravelogueComments(Request $request)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $perPage = $request->query('per_page', 20);
            $perPage = in_array($perPage, [20, 30, 50, 100]) ? $perPage : 20;

            $comments = TravelogueComment::where('abuse_reported', '>', 0)
                ->with('user:id,first_name,last_name', 'travelogue:id,title')
                ->orderByDesc('created_at')
                ->paginate($perPage);

            return response()->json([
                'data' => $comments->items(),
                'pagination' => [
                    'total' => $comments->total(),
                    'per_page' => $comments->perPage(),
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                    'from' => $comments->firstItem(),
                    'to' => $comments->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Get reported travelogue comments error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching reported travelogue comments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete (soft delete) a reported travelogue comment
     */
    public function deleteTravelogueComment($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $comment = TravelogueComment::findOrFail($id);

            // Soft delete the comment
            $comment->delete();

            return response()->json([
                'message' => 'Travelogue comment deleted successfully',
                'data' => $comment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Delete travelogue comment error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting travelogue comment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Discard reported flag from a travelogue comment
     */
    public function discardTravelogueComment($id)
    {
        try {
            // Check if user is admin
            if (!$this->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }

            $comment = TravelogueComment::findOrFail($id);

            // Clear abuse_reported flag
            $comment->update(['abuse_reported' => 0]);

            return response()->json([
                'message' => 'Travelogue comment report discarded successfully',
                'data' => $comment,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Discard travelogue comment report error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error discarding travelogue comment report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
