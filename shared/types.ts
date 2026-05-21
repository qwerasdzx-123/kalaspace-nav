export interface Bookmark {
  id: string;
  name: string;
  url: string;
  domain: string;
}

export interface SubCategory {
  id: string;
  name: string;
  bookmarks: Bookmark[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface BookmarkData {
  version: number;
  lastModified: string;
  categories: Category[];
}

export interface AuthData {
  salt: string;
  hash: string;
}

export interface Env {
  BOOKMARKS_KV: KVNamespace;
  AUTH_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
}

export type ApiAction =
  | 'login' | 'verify' | 'init'
  | 'getBookmarks'
  | 'addBookmark' | 'updateBookmark' | 'deleteBookmark' | 'batchDelete'
  | 'addCategory' | 'updateCategory' | 'deleteCategory'
  | 'addSubCategory' | 'deleteSubCategory'
  | 'reorder'
  | 'importChrome'
  | 'exportHtml' | 'exportJson'
  | 'regenerate';
