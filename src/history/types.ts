export interface HistoryItem {
    id: string;
    timestamp: Date;
    requester_id: string;
    requester_type: 'application' | 'wallet';
    requester_display_name?: string;
    result: 'accepted' | 'rejected';
    attributes_requested: string[];
}
