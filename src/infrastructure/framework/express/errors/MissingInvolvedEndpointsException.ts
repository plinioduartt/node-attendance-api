class MissingInvolvedEndpointsException extends Error {
  public status: number
  public name: string
    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = 'MissedInvolvedEndpointsException'
    }

}

export default MissingInvolvedEndpointsException;