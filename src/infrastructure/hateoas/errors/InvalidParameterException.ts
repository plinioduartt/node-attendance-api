class InvalidParameterException extends Error {
  public status: number
  public name: string
    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = 'InvalidParameterException'
    }

}

export default InvalidParameterException;