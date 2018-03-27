

#include <iostream>
#include <vector>
#include <algorithm>


int main()
{
	std::ios_base::sync_with_stdio(false);

	int t;
	std::cin>>t;

	while(t--)
	{
		int n,c;
		std::cin>>n>>c;

		std::vector<int>stall(n);

		for(int i=0; i<n; i++)
			std::cin>>stall[i];

		std::sort(stall.begin(),stall.end());

		int min = 0,max = stall.back()-stall.front();

		while(min < max)
		{
			int mid = (min+max)/2;

			int pre = 0;

			int done = 1;
			for(int i=1; i<n ;i++)
			{
				if(stall[i] - stall[pre] >= mid)
				{
					done++;
					pre = i;
				}
				if(done ==c)
					break;
			}
			if(done==c)
				min = mid+1;
			else
				max = mid;
		}
		std::cout<<min-1<<"\n";
	}
}
