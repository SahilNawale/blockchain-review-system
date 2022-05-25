// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Review {

    uint userIdCounter = 0;
    uint reviewIdCounter = 0;
    uint productIdCounter = 0;
    
    struct User_{
        uint id;
        string name;
        string password;
        string amazonUsername;
        string flipkartUsername;
        address userAddress;
    }

    struct Review_ {
        uint id;
        string content;
        uint productId;
        address payable reviewedBy;
        string [3] imageHash;
    }

    struct Product_{
        string title;
        string category;
        string platform;
        string link;
        string description;
        uint id;
        address listedBy;
        uint reviewCount;
    }

    User_ [] public allUsers;
    Review_ [] public allReviews;
    Product_[] public allProducts;
    mapping(address=>mapping(uint=>bool)) unlockedProducts;
    
    // constructor(){
    //     addUser("Nagargoje", "1234", "Nag", "Nag");
    //     addProduct("Apple iPhone 12 (64GB) - Blue","mobile and laptops","amazon","https://www.amazon.in/New-Apple-iPhone-12-64GB/dp/B08L5WHFT9/ref=cm_cr_srp_d_product_top?ie=UTF8&th=1","I want to buy this phone , can someone tell me about its battery life?");
    //     addReview(0,"Worst battery performance.Iphone 11 is far better den this..In 4 hour battery will come down from 100 to 15 percent.Please dont buy this product at this price.",
    //     ["asda","sefserg","srgsrg"]
    //     );
    // }

    function addUser(string memory _name,string memory _password,string memory _amazonUsername,string memory _flipkartUsername) public {
        allUsers.push(User_(userIdCounter,_name,_password,_amazonUsername,_flipkartUsername,msg.sender));
        userIdCounter++;
    }

    function addReview(uint _productId,string memory _description,string[3]memory  _imageHash) public {
        allReviews.push(Review_(reviewIdCounter,_description,_productId,payable(msg.sender),_imageHash));
        reviewIdCounter++;
        allProducts[_productId].reviewCount++;
    }
    
    function addProduct(string memory _title,string memory _category,string memory _platform,string memory _link,string memory _description) public {

        allProducts.push(Product_(_title,_category,_platform,_link,_description,productIdCounter,msg.sender,0));
        productIdCounter++;
    }

    function getAllUsers() public view returns (User_ [] memory){
        return allUsers;
    }

    function getAllReviews() public view returns (Review_[] memory){
        return allReviews;
    }

    function getAllProducts() public view returns (Product_[] memory){
        return allProducts;
    }

    function getReviewsForUser() public view returns (Review_[] memory){
       Review_ [] memory tempReviews = allReviews;
        uint pushed = 0;
        for(uint i=0;i<reviewIdCounter;i++){
            if(allReviews[i].reviewedBy == msg.sender){
                tempReviews[pushed] = allReviews[i];
            }
        }
        return tempReviews;
    }

    function hasAccess(uint productId) public view returns (bool){
        if(unlockedProducts[msg.sender][productId]==true){
            return true;
        } 
        else{
            return false;
        } 
    }  

    function getAccess(uint _productId) public payable {
        uint counter = 0;
        require(msg.value*10>1,"send minimum 1 ether");
        for(uint i=0;i<reviewIdCounter;i++){
            if(allReviews[i].productId == _productId){
                counter++;
            }
        }
        for(uint i=0;i<reviewIdCounter;i++){
            if(allReviews[i].productId == _productId){
                allReviews[i].reviewedBy.transfer(msg.value/counter);
            }
        }
        unlockedProducts[msg.sender][_productId] = true;
    }
}