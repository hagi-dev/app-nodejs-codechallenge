# Challenge Node Yape
## Desarrollador: <a href="https://github.com/hagi-dev">Hagi Torres Macedo</a> 
<section style="text-align: center;">
 <a 
      href="https://www.linkedin.com/in/hagitorres/" 
      target="_blank">
      <img src="https://img.shields.io/badge/LinkedIn-0077b5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin">
  </a>
  <a 
     href = "hagiraitorresmacedo@gmail.com" 
     target="_blank">
     <img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail">
 </a>
</section>

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Running the app

```bash
## Inplementation
1. npm install
2. docker-compose up 
3. touch .env
## el .env tiene que estar contenido con:
##example:
# - DB_USER=postgres
# - DB_PASSWORD=postgres
# - DB_NAME=transaction
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_SYNC=true 

# execute proyect
$ nest start port-services
$ nest start transaction
$ nest start anti-fraud
```

<hr/><br/>

## Challenge Description

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

## Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

## Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

## Send us your challenge

When you finish your challenge, after forking a repository, you can open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

## Code Helpers

<details><summary>Bash Commands</summary>

```bash
# Implementations
$ nest g app port-services
$ npm i --save @nestjs/microservices
$ npm install --save @nestjs/typeorm typeorm pg
$ npm i kafkajs
$ npm install dotenv --save
```

</details><br/>

## Support

- Author - [Hagi Torres Macedo](https://www.linkedin.com/in/hagitorres/)
- Contact - [hagiraitorresmacedo@gmail.com](mailto:hagiraitorresmacedo@gmail.com)

## License

Nest is [MIT licensed](LICENSE).
