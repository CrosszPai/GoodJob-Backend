import { createConnection } from "typeorm"

const initORM = async () => {
    let connection = await createConnection(
        {
            type: 'postgres',
            url: process.env.url,
            entities: [`${process.env.NODE_ENV === 'production' ? 'build' : 'src'}/entity/**/*.*.js`],
            synchronize: true,
            logging: false
        }
    )
    console.log(connection);

}

export default initORM