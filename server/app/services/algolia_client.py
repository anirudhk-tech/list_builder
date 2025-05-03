import requests
from typing import List, Optional
import typing

class AlgoliaClient:
    def __init__(self, app_id: str, api_key: str):
        self.app_id = app_id
        self.api_key = api_key
        self.base_url = f"https://{app_id}-dsn.algolia.net/1/indexes/"
        self.headers = {
            "X-Algolia-API-Key": api_key,
            "X-Algolia-Application-Id": app_id,
            "Content-Type": "application/json"
        }
    
    def search(
            self,
            index: str,
            query: str,
            attributes: Optional[List[str]] = None,
            filters: Optional[str] = None,
            hits_per_page: int = 20,
    ) -> List[dict]:
        """
        Search for records in the specified Algolia index.
        
        :param index: The name of the Algolia index to search.
        :param query: The search query string.
        :param attributes: List of attributes to retrieve. If None, all attributes are returned.
        :param filters: Filters to apply to the search query.
        :param hits_per_page: Number of hits to return per page.
        :return: List of search results as dictionaries.
        """

        url = f"{self.base_url}{index}/query"
        payload = {
            "query": query,
            "attributesToRetrieve": attributes or ["*"],
            "filters": filters or "",
            "hitsPerPage": hits_per_page
        }
        
        response = requests.post(url, headers=self.headers, json=payload)
        response.raise_for_status()

        return response.json.get("hits", [])