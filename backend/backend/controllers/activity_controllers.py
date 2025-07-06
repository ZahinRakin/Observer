# under construction.


# from fastapi import HTTPException
# from backend.models.activity_log_model import ActivityLog, ActivityType, ActivityLevel
# from typing import List, Optional
# from datetime import datetime, timedelta
# from beanie.odm.enums import SortDirection

# async def log_activity(
#     activity_type: ActivityType,
#     description: str,
#     user_id: Optional[str] = None,
#     username: Optional[str] = None,
#     details: Optional[dict] = None,
#     level: ActivityLevel = ActivityLevel.INFO,
#     ip_address: Optional[str] = None,
#     user_agent: Optional[str] = None
# ):
#     """Log a system activity"""
#     try:
#         activity = ActivityLog(
#             activity_type=activity_type,
#             user_id=user_id,
#             username=username,
#             description=description,
#             details=details,
#             level=level,
#             ip_address=ip_address,
#             user_agent=user_agent
#         )
#         await activity.insert()
#         return activity
#     except Exception as e:
#         # Don't raise exception for logging failures to avoid breaking main functionality
#         print(f"Failed to log activity: {str(e)}")
#         return None

# async def get_recent_activities(limit: int = 10, activity_type: Optional[ActivityType] = None):
#     """Get recent system activities"""
#     try:
#         query = {}
#         if activity_type:
#             query["activity_type"] = activity_type
        
#         activities = await ActivityLog.find(query).sort([("created_at", SortDirection.DESCENDING)]).limit(limit).to_list()
#         return activities
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching activities: {str(e)}")

# async def get_activities_by_user(user_id: str, limit: int = 20):
#     """Get activities for a specific user"""
#     try:
#         activities = await ActivityLog.find({"user_id": user_id}).sort([("created_at", SortDirection.DESCENDING)]).limit(limit).to_list()
#         return activities
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching user activities: {str(e)}")

# async def get_activities_by_date_range(start_date: datetime, end_date: datetime, limit: int = 100):
#     """Get activities within a date range"""
#     try:
#         activities = await ActivityLog.find({
#             "created_at": {
#                 "$gte": start_date,
#                 "$lte": end_date
#             }
#         }).sort([("created_at", SortDirection.DESCENDING)]).limit(limit).to_list()
#         return activities
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching activities by date range: {str(e)}")

# async def get_activity_statistics(days: int = 7):
#     """Get activity statistics for the last N days"""
#     try:
#         start_date = datetime.utcnow() - timedelta(days=days)
        
#         # Get activity counts by type
#         pipeline = [
#             {"$match": {"created_at": {"$gte": start_date}}},
#             {"$group": {
#                 "_id": "$activity_type",
#                 "count": {"$sum": 1}
#             }},
#             {"$sort": {"count": -1}}
#         ]
        
#         stats = await ActivityLog.aggregate(pipeline).to_list()
        
#         # Get total activities
#         total_activities = await ActivityLog.find({"created_at": {"$gte": start_date}}).count()
        
#         # Get activities by level
#         level_stats = await ActivityLog.aggregate([
#             {"$match": {"created_at": {"$gte": start_date}}},
#             {"$group": {
#                 "_id": "$level",
#                 "count": {"$sum": 1}
#             }}
#         ]).to_list()
        
#         return {
#             "total_activities": total_activities,
#             "by_type": stats,
#             "by_level": level_stats,
#             "period_days": days
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching activity statistics: {str(e)}")

# async def cleanup_old_activities(days_to_keep: int = 90):
#     """Clean up activities older than specified days"""
#     try:
#         cutoff_date = datetime.utcnow() - timedelta(days=days_to_keep)
#         result = await ActivityLog.find({"created_at": {"$lt": cutoff_date}}).delete()
#         return {"deleted_count": result.deleted_count if result else 0}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error cleaning up old activities: {str(e)}") 