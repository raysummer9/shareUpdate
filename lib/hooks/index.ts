// Export all hooks for easy importing

// Listings
export {
  useListings,
  useListing,
  useMyListings,
  useListingMutations,
  type ListingFilters,
  type ListingWithSeller,
} from "./use-listings";

// Orders
export {
  useOrders,
  useOrder,
  useOrderMutations,
  useOrderStats,
  type OrderStatus,
  type OrderWithDetails,
  type OrderFilters,
} from "./use-orders";

// Wallet & Transactions
export {
  useWallet,
  useWalletTransactions,
  useBankAccounts,
  useWalletMutations,
  useWalletStats,
  type TransactionType,
  type TransactionFilters,
} from "./use-wallet";

// Buyer Requests & Bids
export {
  useRequests,
  useRequest,
  useMyRequests,
  useMyBids,
  useRequestMutations,
  useBidMutations,
  type RequestWithDetails,
  type BidWithSeller,
  type RequestFilters,
} from "./use-requests";

// Categories
export {
  useCategories,
  useFlatCategories,
  useCategoryBySlug,
  type CategoryWithChildren,
} from "./use-categories";

// Reviews
export {
  useReviews,
  useMyGivenReviews,
  useMyReceivedReviews,
  usePendingReviews,
  useReviewMutations,
  type ReviewWithDetails,
  type ReviewFilters,
} from "./use-reviews";

// Messaging
export {
  useConversations,
  useMessages,
  useMessageMutations,
  useUnreadMessageCount,
  type ConversationWithDetails,
  type MessageWithSender,
} from "./use-messages";

// Notifications
export {
  useNotifications,
  useUnreadNotificationCount,
  useNotificationMutations,
  createOrderNotification,
  createMessageNotification,
  createReviewNotification,
  type NotificationFilters,
} from "./use-notifications";

// Disputes
export {
  useDisputes,
  useDispute,
  useDisputeMutations,
  useDisputeStats,
  type DisputeWithDetails,
  type DisputeMessageWithSender,
  type DisputeFilters,
  type DisputeReason,
} from "./use-disputes";

// Wishlist
export {
  useWishlist,
  useIsInWishlist,
  useWishlistMutations,
  useWishlistCount,
  usePriceAlerts,
  type WishlistItemWithListing,
} from "./use-wishlist";

// File Uploads
export {
  useFileUpload,
  useAvatarUpload,
  useListingImageUpload,
  useMessageAttachmentUpload,
  useDisputeEvidenceUpload,
  useFileDelete,
  BUCKETS,
  validateFile,
  type BucketName,
  type UploadResult,
  type UploadOptions,
} from "./use-file-upload";

// Search
export {
  useListingSearch,
  useQuickSearch,
  useSellerSearch,
  useRequestSearch,
  useRecentSearches,
  type SearchResult,
  type ListingSearchResult,
  type SearchFilters,
} from "./use-search";

